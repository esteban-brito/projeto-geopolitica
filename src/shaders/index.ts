import background from "./background.wgsl?raw";
import glass from "./glass.wgsl?raw";
import pyramid from "./pyramid.wgsl?raw";

export interface ShaderSources {
  background: string;
  glass: string;
  pyramid: string;
}

type Listener = (sources: ShaderSources) => void;

let current: ShaderSources = { background, glass, pyramid };
const listeners = new Set<Listener>();

export function shaderSources(): ShaderSources {
  return current;
}

/** Hot reload: edits to a .wgsl file reach the renderer without reloading the page or its state. */
export function onShaderChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

if (import.meta.hot) {
  import.meta.hot.accept(["./background.wgsl?raw", "./glass.wgsl?raw", "./pyramid.wgsl?raw"], ([bg, gl, py]) => {
    const text = (m: unknown) => (m as { default?: string } | undefined)?.default;
    current = {
      background: text(bg) ?? current.background,
      glass: text(gl) ?? current.glass,
      pyramid: text(py) ?? current.pyramid,
    };
    for (const listener of listeners) listener(current);
  });
}
