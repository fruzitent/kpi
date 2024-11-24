import { POSTS } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import page from "@/pages/home.html?url";
import styles from "@/pages/home.module.css" with { type: "css" };

class PageHome extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "page-home", styles).unwrap();
  }

  connectedCallback() {
    const selector = "ol";
    const olist = this.shadowRoot?.querySelector(selector);
    if (typeof olist === "undefined" || olist === null) {
      return alert(`failed to query: ${selector}`);
    }

    for (const post of POSTS) {
      const component = document.createElement("component-post");
      component.setAttribute("data-__blob", JSON.stringify(post));
      const item = document.createElement("li");
      item.appendChild(component);
      olist.appendChild(item);
    }
  }

  disconnectedCallback() {
    const selector = "ol";
    const olist = this.shadowRoot?.querySelector(selector);
    if (typeof olist === "undefined" || olist === null) {
      return alert(`failed to query: ${selector}`);
    }
    olist.innerHTML = "";
  }
}

(async () => {
  (await insertFile(page)).unwrap();
  (await defineComponent("page-home", PageHome)).unwrap();
})();
