import { Err, Ok, Result } from "oxide.ts";

import shared from "@/styles/shared.module.css" with { type: "css" };

const createElement = <E extends Element>(elem: E): Result<Element, Error> => {
  if (elem instanceof HTMLScriptElement) {
    const script = document.createElement("script");
    script.src = elem.src ?? "";
    script.type = elem.type ?? "module";
    return Ok(script);
  }

  if (elem instanceof HTMLTemplateElement) {
    return Ok(elem);
  }

  return Err(new Error("unexpected element", { cause: elem }));
};

export const defineComponent = async <E extends typeof HTMLElement>(
  name: string,
  elem: E,
): Promise<Result<CustomElementConstructor, Error>> => {
  const [err0, _0] = Result.safe(() => customElements.define(name, elem)).intoTuple();
  if (err0) {
    return Err(new Error("failed to define component", { cause: err0 }));
  }

  const [err1, val1] = (await Result.safe(customElements.whenDefined(name))).intoTuple();
  if (err1) {
    return Err(new Error("failed to query", { cause: err1 }));
  }

  return Ok(val1);
};

const fetchFile = async (path: string): Promise<Result<string, Error>> => {
  const input = new URL(path, import.meta.url).href;
  const [err, val] = (await Result.safe(fetch(input).then((data) => data.text()))).intoTuple();
  if (err) {
    return Err(new Error("failed to fetch", { cause: err }));
  }
  return Ok(val);
};

export const insertFile = async (path: string): Promise<Result<void, Error>> => {
  const [err0, val0] = (await fetchFile(path)).intoTuple();
  if (err0) {
    return Err(new Error("failed to fetch", { cause: err0 }));
  }

  const parser = new DOMParser();
  const [err1, val1] = Result.safe(() => parser.parseFromString(val0, "text/html")).intoTuple();
  if (err1) {
    return Err(new Error("failed to parse", { cause: err1 }));
  }

  for (const elem of Array.from(val1.head.children)) {
    const [err2, val2] = createElement(elem).intoTuple();
    if (err2) {
      return Err(new Error("failed to create element", { cause: err2 }));
    }

    const [err3, _3] = Result.safe(() => document.body.appendChild(val2)).intoTuple();
    if (err3) {
      return Err(new Error("failed to populate", { cause: err3 }));
    }
  }

  return Ok(undefined);
};

export const populateNode = <N extends HTMLElement, T extends string>(
  node: N,
  tag: T,
  styles?: CSSStyleSheet,
): Result<void, Error> => {
  const template = document.querySelector<HTMLTemplateElement>(`template#${tag}`);
  if (template === null) {
    return Err(new Error("failed to query", { cause: `#${tag}` }));
  }

  const [err0, _0] = Result.safe(() => node.attachShadow({ mode: "open" })).intoTuple();
  if (err0) {
    return Err(new Error("failed to attach", { cause: err0 }));
  }

  const children = template.content.cloneNode(true);
  const [err1, _1] = Result.safe(() => node.shadowRoot?.appendChild(children)).intoTuple();
  if (err1) {
    return Err(new Error("failed to populate", { cause: err1 }));
  }

  if (!styles) {
    return Ok(undefined);
  }

  for (const css of [shared, styles]) {
    const [err2, _2] = Result.safe(() => node.shadowRoot?.adoptedStyleSheets.push(css)).intoTuple();
    if (err2) {
      return Err(new Error("failed to style", { cause: err2 }));
    }
  }

  return Ok(undefined);
};
