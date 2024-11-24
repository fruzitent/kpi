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
  return Err(new Error(`unexpected elem: ${elem}`));
};

export const defineComponent = async <E extends typeof HTMLElement>(
  name: string,
  elem: E,
): Promise<Result<CustomElementConstructor, Error>> => {
  const fn0 = () => customElements.define(name, elem);
  const [err0, val0] = Result.safe(fn0).intoTuple();
  if (err0) {
    return Err(new Error(`failed to define element: ${err0}`));
  }
  return Result.safe(customElements.whenDefined(name));
};

const fetchFile = async (path: string): Promise<Result<string, Error>> => {
  const input = new URL(path, import.meta.url).href;
  return Result.safe(fetch(input).then((data) => data.text()));
};

export const insertFile = async (
  path: string,
): Promise<Result<void, Error>> => {
  const [err0, val0] = (await fetchFile(path)).intoTuple();
  if (err0) {
    return Err(new Error(`failed to fetch file: ${err0}`));
  }

  const parser = new DOMParser();
  const fn1 = () => parser.parseFromString(val0, "text/html");
  const [err1, doc] = Result.safe(fn1).intoTuple();
  if (err1) {
    return Err(new Error(`failed to parse html: ${err1}`));
  }

  for (const elem of Array.from(doc.head.children)) {
    const [err2, val2] = buildElement(elem).intoTuple();
    if (err2) {
      return Err(new Error(`failed to build element: ${err2}`));
    }

    const fn3 = () => document.body.appendChild(val2);
    const [err3, val3] = Result.safe(fn3).intoTuple();
    if (err3) {
      return Err(new Error(`failed to populate tree: ${err3}`));
    }
  }

  return Ok(undefined);
};

export const populateNode = <N extends HTMLElement, T extends string>(
  node: N,
  tag: T,
  styles?: CSSStyleSheet,
): Result<void, Error> => {
  const selector = `template#${tag}`;
  const template = document.querySelector<HTMLTemplateElement>(selector);
  if (template === null) {
    return Err(new Error(`failed to query: ${selector}`));
  }

  const fn0 = () => node.attachShadow({ mode: "open" });
  const [err0, val0] = Result.safe(fn0).intoTuple();
  if (err0) {
    return Err(new Error(`failed to attach shadow: ${err0}`));
  }

  const children = template.content.cloneNode(true);
  let fn1 = () => node.shadowRoot?.appendChild(children);
  const [err1, val1] = Result.safe(fn1).intoTuple();
  if (err1) {
    return Err(new Error(`failed to append children: ${err1}`));
  }

  if (styles) {
    for (const style of [shared, styles]) {
      const fn2 = () => node.shadowRoot?.adoptedStyleSheets.push(style);
      const [err2, val2] = Result.safe(fn2).intoTuple();
      if (err2) {
        return Err(new Error(`failed to adopt style sheets: ${err2}`));
      }
    }
  }

  return Ok(undefined);
};
