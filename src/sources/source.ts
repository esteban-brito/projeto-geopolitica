/**
 * Where the content behind the glass comes from. The renderer only sees a texture: swapping
 * HTML-in-Canvas for a native scene, or removing it, never touches the renderer.
 */
export interface BackgroundSource {
  readonly kind: "native" | "html-in-canvas" | "raster";
  readonly label: string;
  /**
   * Bring `target` (device pixels, sRGB) up to date. Returns true when its pixels changed, so the
   * pyramid and anything derived from the content can be rebuilt only then.
   */
  update(device: GPUDevice, target: GPUTexture, sizeChanged: boolean): boolean;
  dispose(): void;
}
