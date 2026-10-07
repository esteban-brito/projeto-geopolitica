import type { BackgroundSource } from "./source.ts";

/**
 * HTML-in-Canvas as a background source: real, live, interactive DOM painted by the browser and
 * refracted by the glass. The API is an origin trial that changed names three times in six months
 * (docs/research/projetos/02), so every name is probed at runtime — never a browser version — and
 * this file is the only place that touches it.
 *
 * Two ways to the GPU, tried in this order:
 * - direct: the queue writes the element into the texture (drawElementImageToTexture, or one of
 *   the two older copyElementImageToTexture signatures);
 * - 2D bridge: the element is drawn into a 2D canvas (drawElementImage, or the older drawElement /
 *   drawHTMLElement) and uploaded with copyExternalImageToTexture. One copy more, but the 2D API
 *   has been the steadiest; Canvas UI chose it for that reason.
 *
 * The page lives inside a canvas that opts in (`layoutsubtree`, renamed to `content="drawable"`;
 * both are set), under the stage, so it keeps hit testing, focus and the accessibility tree.
 */

type Draw2D = "drawElementImage" | "drawElement" | "drawHTMLElement";
type DrawGpu = "drawElementImageToTexture" | "copyElementImageToTexture";

export interface HtmlInCanvasSupport {
  /** The canvas opt-in exists (the element is laid out inside the canvas). */
  layout: boolean;
  draw2d: Draw2D | null;
  gpu: DrawGpu | null;
  /** `paint` event with the changed elements; without it we invalidate on our own. */
  paintEvent: boolean;
}

export function htmlInCanvasSupport(device: GPUDevice | null): HtmlInCanvasSupport {
  const canvasProto = HTMLCanvasElement.prototype as unknown as Record<string, unknown>;
  const ctxProto = CanvasRenderingContext2D.prototype as unknown as Record<string, unknown>;
  const queue = device?.queue as unknown as Record<string, unknown> | undefined;
  const draw2d = (["drawElementImage", "drawElement", "drawHTMLElement"] as const).find((n) => typeof ctxProto[n] === "function") ?? null;
  const gpu = queue ? ((["drawElementImageToTexture", "copyElementImageToTexture"] as const).find((n) => typeof queue[n] === "function") ?? null) : null;
  return {
    layout: "layoutSubtree" in canvasProto || "requestPaint" in canvasProto || draw2d !== null,
    draw2d,
    gpu,
    paintEvent: "onpaint" in canvasProto || "requestPaint" in canvasProto,
  };
}

export function htmlInCanvasAvailable(support: HtmlInCanvasSupport): boolean {
  return support.layout && (support.draw2d !== null || support.gpu !== null);
}

/** Which path is drawing, for the stats panel. */
export type HtmlInCanvasPath = `direto: ${string}` | `ponte 2D: ${Draw2D}` | "indisponível";

type AnyFn = (...args: unknown[]) => unknown;

export class HtmlInCanvasSource implements BackgroundSource {
  readonly kind = "html-in-canvas";
  readonly label: string;
  onInvalidate: (() => void) | null = null;
  path: HtmlInCanvasPath = "indisponível";
  /** Why no path works in this browser, once known; the owner should fall back to a native scene. */
  failure: string | null = null;
  onFail: ((reason: string) => void) | null = null;

  /** The canvas that hosts the page, under the stage; it is also the 2D bridge's surface. */
  readonly host: HTMLCanvasElement;
  readonly page: HTMLElement;
  private readonly support: HtmlInCanvasSupport;
  private readonly dprOf: () => number;
  private readonly ctx: CanvasRenderingContext2D | null;
  private dirty = true;
  private gpuCall: ((target: GPUTexture, width: number, height: number) => void) | null = null;
  private gpuTried = false;
  private readonly cleanups: (() => void)[] = [];
  /** Set when the direct path is allowed (Ultra); the 2D bridge is the default. */
  preferDirect = false;

  constructor(label: string, container: HTMLElement, page: HTMLElement, support: HtmlInCanvasSupport, dprOf: () => number) {
    this.label = label;
    this.support = support;
    this.dprOf = dprOf;
    this.page = page;
    this.host = document.createElement("canvas");
    this.host.className = "hic-host";
    this.host.setAttribute("layoutsubtree", "");
    this.host.setAttribute("content", "drawable");
    page.setAttribute("drawable", "");
    this.host.append(page);
    container.prepend(this.host);
    this.ctx = this.host.getContext("2d");

    const invalidate = () => this.invalidate();
    if (support.paintEvent) this.listen(this.host, "paint", invalidate);
    // Without a paint event (older builds), anything that can change the page's pixels invalidates.
    const observer = new MutationObserver(invalidate);
    observer.observe(page, { subtree: true, childList: true, characterData: true, attributes: true });
    this.cleanups.push(() => observer.disconnect());
    for (const type of ["scroll", "input", "change", "focusin", "focusout", "pointerover", "pointerout", "transitionend", "animationiteration"]) {
      this.listen(page, type, invalidate, true);
    }
  }

  private listen(target: EventTarget, type: string, fn: () => void, capture = false): void {
    target.addEventListener(type, fn, { capture, passive: true });
    this.cleanups.push(() => target.removeEventListener(type, fn, { capture }));
  }

  invalidate(): void {
    this.dirty = true;
    (this.host as unknown as { requestPaint?: () => void }).requestPaint?.();
    this.onInvalidate?.();
  }

  update(device: GPUDevice, target: GPUTexture, sizeChanged: boolean): boolean {
    if (!this.dirty && !sizeChanged) return false;
    this.dirty = false;
    const { width, height } = target;
    if (this.host.width !== width || this.host.height !== height) {
      this.host.width = width;
      this.host.height = height;
    }
    if (this.failure) return false;
    if (this.preferDirect && this.drawDirect(device, target, width, height)) return true;
    if (this.drawBridge(device, target, width, height)) return true;
    if (this.drawDirect(device, target, width, height)) return true;
    this.fail(this.failure ?? "nenhuma das assinaturas conhecidas desenhou o elemento");
    return false;
  }

  private fail(reason: string): void {
    this.failure = reason;
    this.path = "indisponível";
    this.onFail?.(reason);
  }

  /** The queue writes the element straight into the texture; tries each known signature once. */
  private drawDirect(device: GPUDevice, target: GPUTexture, width: number, height: number): boolean {
    if (this.gpuCall) {
      try {
        this.gpuCall(target, width, height);
        return true;
      } catch {
        this.gpuCall = null;
      }
    }
    if (this.gpuTried || !this.support.gpu) return false;
    this.gpuTried = true;
    const queue = device.queue as unknown as Record<string, AnyFn>;
    const el = this.page;
    const attempts: [string, (t: GPUTexture, w: number, h: number) => void][] = [
      ["drawElementImageToTexture", (t, w, h) => queue.drawElementImageToTexture!.call(queue, { source: el }, { texture: t, size: { width: w, height: h } })],
      ["copyElementImageToTexture", (t, w, h) => queue.copyElementImageToTexture!.call(queue, el, { destination: { texture: t }, width: w, height: h })],
      ["copyElementImageToTexture (antiga)", (t, w, h) => queue.copyElementImageToTexture!.call(queue, el, w, h, { texture: t })],
    ];
    for (const [name, call] of attempts) {
      if (typeof queue[name.split(" ")[0]!] !== "function") continue;
      try {
        call(target, width, height);
        this.gpuCall = call;
        this.path = `direto: ${name}`;
        this.updateGeometry(new DOMMatrix().scale(this.dprOf()));
        return true;
      } catch {
        // Next signature.
      }
    }
    return false;
  }

  /** 2D bridge: draw the element into the host canvas, upload it. */
  private drawBridge(device: GPUDevice, target: GPUTexture, width: number, height: number): boolean {
    const name = this.support.draw2d;
    const ctx = this.ctx as unknown as Record<string, AnyFn> | null;
    if (!name || !ctx || !this.ctx) return false;
    const dpr = this.dprOf();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    try {
      ctx[name]!.call(this.ctx, this.page, 0, 0);
      device.queue.copyExternalImageToTexture({ source: this.host }, { texture: target }, [width, height]);
    } catch (error) {
      // Early builds (Chromium ~141, drawElement) mark the canvas as cross-origin after drawing any
      // element, and a tainted canvas cannot be uploaded. The current API paints only what is safe
      // to read back and leaves the canvas clean.
      if (error instanceof DOMException && error.name === "SecurityError") {
        this.failure = `${name} marca o canvas como de outra origem (versão antiga da API): a imagem não pode ir para a GPU`;
      }
      return false;
    }
    this.path = `ponte 2D: ${name}`;
    return true;
  }

  /** Hit testing and accessibility follow where the element is drawn (WebGL/WebGPU paths need it). */
  private updateGeometry(transform: DOMMatrix): void {
    const fn = (this.host as unknown as { updateElementGeometry?: (el: Element, o: object) => void }).updateElementGeometry;
    try {
      fn?.call(this.host, this.page, { canvasTransform: transform });
    } catch {
      // Optional.
    }
  }

  dispose(): void {
    for (const c of this.cleanups) c();
    this.host.remove();
  }
}
