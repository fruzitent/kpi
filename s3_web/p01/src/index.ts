import { Err, Ok } from "@/rustify.ts";

import type { Result } from "@/rustify.ts";

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
  document.body.insertAdjacentHTML("beforeend", res.value);
};

export const populateNode = <
  N extends HTMLElement,
  S extends string, // TODO: keyof HTMLElementTagNameMap
>(
  node: N,
  selector: S,
): Result<void, string> => {
  const template = document.querySelector<HTMLTemplateElement>(selector);
  if (template === null) {
    return Err(`failed to query: ${selector}`);
  }
  node.attachShadow({ mode: "open" });
  node.shadowRoot?.appendChild(template.content.cloneNode(true));
  return Ok(undefined);
};
