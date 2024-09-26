import { fetchPages } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import type { Page } from "@/data.ts";

import styles from "@/components/navbar.module.css" with { type: "css" };

class Navbar extends HTMLElement {
  constructor() {
    super();
    const res = populateNode(this, "template#navbar");
    if (!res.ok) {
      alert(`failed to populate node: ${res.error}`);
      return;
    }
  }

  async connectedCallback() {
    const res = await fetchPages();
    if (!res.ok) {
      return alert(`failed to fetch pages: ${res.error}`);
    }
    this.#render(res.value);
  }

  #render(pages: Page[]) {
    const selector = "ol";
    const olist = this.shadowRoot?.querySelector<HTMLOListElement>(selector);
    if (typeof olist === "undefined" || olist === null) {
      return alert(`failed to query: ${selector}`);
    }

    for (const page of pages) {
      const item = document.createElement("my-navbar-item");
      item.dataset.href = page.href;
      item.dataset.title = page.title;
      olist.appendChild(item);
    }
  }
}

class NavbarItem extends HTMLElement {
  constructor() {
    super();
    const res = populateNode(this, "template#navbar-item");
    if (!res.ok) {
      alert(`failed to populate node: ${res.error}`);
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

    this.#render(href, title);
  }

  #render(href: string, title: string) {
    const selector = "a";
    const anchor = this.shadowRoot?.querySelector<HTMLAnchorElement>(selector);
    if (typeof anchor === "undefined" || anchor === null) {
      return alert(`failed to query: ${selector}`);
    }
    anchor.href = href;
    anchor.innerHTML = title;
  }
}

(async () => {
  await insertFile("/templates/navbar.html");
  await defineComponent("my-navbar", Navbar);
  await defineComponent("my-navbar-item", NavbarItem);
})();
