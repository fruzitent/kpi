import { Err, Ok, Result } from "oxide.ts";

import { fetchPages } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import type { Page } from "@/data.ts";

import styles from "@/components/navbar.module.css" with { type: "css" };

class Navbar extends HTMLElement {
  constructor() {
    super();
    let [err, val] = populateNode(this, "template#navbar", styles).intoTuple();
    if (err) {
      alert(`failed to populate node: ${err}`);
      return;
    }
  }

  async connectedCallback() {
    const [err0, val0] = (await fetchPages()).intoTuple();
    if (err0) {
      return alert(`failed to fetch pages: ${err0}`);
    }
    const [err1, val1] = this.#render(val0).intoTuple();
    if (err1) {
      return alert(`failed to render: ${err1}`);
    }
  }

  #render(pages: Page[]): Result<void, Error> {
    const selector = "ol";
    const olist = this.shadowRoot?.querySelector<HTMLOListElement>(selector);
    if (typeof olist === "undefined" || olist === null) {
      return Err(new Error(`failed to query: ${selector}`));
    }

    for (const page of pages) {
      const item = document.createElement("my-navbar-item");
      item.dataset.href = page.href;
      item.dataset.title = page.title;
      const fn = () => olist.appendChild(item);
      const [err, val] = Result.safe(fn).intoTuple();
      if (err) {
        return Err(new Error(`failed to append child: ${err}`));
      }
    }

    return Ok(undefined);
  }
}

class NavbarItem extends HTMLElement {
  constructor() {
    super();
    const [err, val] = populateNode(this, "template#navbar-item").intoTuple();
    if (err) {
      alert(`failed to populate node: ${err}`);
      return;
    }
    this.shadowRoot?.adoptedStyleSheets.push(styles);
  }

  connectedCallback() {
    const href = this.getAttribute("data-href");
    if (href === null) {
      return alert("missing required parameter: href");
    }

    const title = this.getAttribute("data-title");
    if (title === null) {
      return alert("missing required parameter: title");
    }

    const [err0, val0] = this.#render(href, title).intoTuple();
    if (err0) {
      return alert(`failed to render: ${err0}`);
    }
  }

  #render(href: string, title: string): Result<void, Error> {
    const selector = "a";
    const anchor = this.shadowRoot?.querySelector<HTMLAnchorElement>(selector);
    if (typeof anchor === "undefined" || anchor === null) {
      return Err(new Error(`failed to query: ${selector}`));
    }
    anchor.href = href;
    anchor.innerHTML = title;
    return Ok(undefined);
  }
}

(async () => {
  (await insertFile("/templates/components/navbar.html")).unwrap();
  (await defineComponent("my-navbar", Navbar)).unwrap();
  (await defineComponent("my-navbar-item", NavbarItem)).unwrap();
})();
