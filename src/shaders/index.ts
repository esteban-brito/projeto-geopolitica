import background from "./background.wgsl?raw";
import glass from "./glass.wgsl?raw";

export interface ShaderSources {
  background: string;
  glass: string;
}

type Listener = (sources: ShaderSources) => void;

let current: ShaderSources = { background, glass };
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
  import.meta.hot.accept(["./background.wgsl?raw", "./glass.wgsl?raw"], ([bg, gl]) => {
    current = {
      background: (bg as { default?: string } | undefined)?.default ?? current.background,
      glass: (gl as { default?: string } | undefined)?.default ?? current.glass,
    };
    for (const listener of listeners) listener(current);
  });
}
