import { Err, Ok } from "@/rustify.ts";

import type { Result } from "@/rustify.ts";

const buildElement = <N extends Element>(node: N): Result<Element, string> => {
  if (node instanceof HTMLScriptElement) {
    const script = document.createElement("script");
    script.src = node.src ?? "";
    script.type = node.type ?? "module";
    return Ok(script);
  }
  if (node instanceof HTMLTemplateElement) {
    return Ok(node);
  }
  return Err(`unexpected node: ${node}`);
};

export const defineComponent = async <E extends typeof HTMLElement>(
  name: string,
  elem: E,
): Promise<Result<CustomElementConstructor, string>> => {
  customElements.define(name, elem);
  try {
    return Ok(await customElements.whenDefined(name));
  } catch (err) {
    return Err(`${name} is not a valid custom element name: ${err}`);
  }
};

export const fetchFile = async (
  path: string,
): Promise<Result<string, string>> => {
  const res = await fetch(new URL(path, import.meta.url).href);
  if (!res.ok) {
    return Err(`file not found: ${res.status} ${res.url} ${res.statusText}`);
  }
  return Ok(await res.text());
};

export const insertFile = async (path: string): Promise<void> => {
  const res = await fetchFile(path);
  if (!res.ok) {
    return alert(`failed to fetch file: ${res.error}`);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(res.value, "text/html");

  for (const node of Array.from(doc.head.children)) {
    const res = buildElement(node);
    if (!res.ok) {
      alert(`failed to build element: ${res.error}`);
      continue;
    }
    document.body.appendChild(res.value);
  }
};

export const populateNode = <
  N extends HTMLElement,
  S extends string, // TODO: keyof HTMLElementTagNameMap
>(
  node: N,
  selector: S,
  styles?: CSSStyleSheet,
): Result<void, string> => {
  const template = document.querySelector<HTMLTemplateElement>(selector);
  if (template === null) {
    return Err(`failed to query: ${selector}`);
  }
  node.attachShadow({ mode: "open" });
  node.shadowRoot?.appendChild(template.content.cloneNode(true));
  if (styles) {
    node.shadowRoot?.adoptedStyleSheets.push(styles);
  }
  return Ok(undefined);
};
