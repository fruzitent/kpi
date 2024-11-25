import { Err, Ok, Result } from "oxide.ts";

import shared from "@/styles/shared.module.css" with { type: "css" };

const buildElement = <E extends Element>(elem: E): Result<Element, Error> => {
  if (elem instanceof HTMLScriptElement) {
    const script = document.createElement("script");
    script.src = elem.src ?? "";
    script.type = elem.type ?? "module";
    return Ok(script);
  }
  if (elem instanceof HTMLTemplateElement) {
    return Ok(elem);
  }
  return Err(Error(`unexpected elem`, { cause: elem }));
};

export const defineComponent = async <E extends typeof HTMLElement>(
  name: string,
  elem: E,
): Promise<Result<CustomElementConstructor, Error>> => {
  const fn = () => customElements.define(name, elem);
  const [err, _] = Result.safe(fn).intoTuple();
  if (err) {
    return Err(Error(`failed to define element`, { cause: err }));
  }
  return Result.safe(customElements.whenDefined(name));
};

const fetchFile = async (path: string): Promise<Result<string, Error>> => {
  const input = new URL(path, import.meta.url).href;
  return Result.safe(fetch(input).then((data) => data.text()));
};

export const insertFile = async (path: string): Promise<Result<void, Error>> => {
  const [err0, val0] = (await fetchFile(path)).intoTuple();
  if (err0) {
    return Err(Error("failed to fetch file", { cause: err0 }));
  }

  const parser = new DOMParser();
  const fn1 = () => parser.parseFromString(val0, "text/html");
  const [err1, doc] = Result.safe(fn1).intoTuple();
  if (err1) {
    return Err(Error("failed to parse html", { cause: err1 }));
  }

  for (const elem of Array.from(doc.head.children)) {
    const [err2, val2] = buildElement(elem).intoTuple();
    if (err2) {
      return Err(Error("failed to build element", { cause: err2 }));
    }

    const fn3 = () => document.body.appendChild(val2);
    const [err3, val3] = Result.safe(fn3).intoTuple();
    if (err3) {
      return Err(Error("failed to populate tree", { cause: err3 }));
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
    return Err(Error("failed to query", { cause: `template#${tag}` }));
  }

  const fn0 = () => node.attachShadow({ mode: "open" });
  const [err0, val0] = Result.safe(fn0).intoTuple();
  if (err0) {
    return Err(Error("failed to attach shadow", { cause: err0 }));
  }

  const children = template.content.cloneNode(true);
  const fn1 = () => node.shadowRoot?.appendChild(children);
  const [err1, val1] = Result.safe(fn1).intoTuple();
  if (err1) {
    return Err(Error("failed to append children", { cause: err1 }));
  }

  if (!styles) {
    return Ok(undefined);
  }

  for (const style of [shared, styles]) {
    const fn2 = () => node.shadowRoot?.adoptedStyleSheets.push(style);
    const [err2, val2] = Result.safe(fn2).intoTuple();
    if (err2) {
      return Err(Error("failed to adopt style sheets", { cause: err2 }));
    }
  }

  return Ok(undefined);
};
