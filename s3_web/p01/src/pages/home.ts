import { fetchPosts } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import page from "@/pages/home.html?url";
import styles from "@/pages/home.module.css" with { type: "css" };

class PageHome extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "page-home", styles).unwrap();
  }

  async connectedCallback() {
    const ol = this.shadowRoot?.querySelector("ol");
    if (typeof ol === "undefined" || ol === null) {
      return alert(`failed to query: ol`);
    }

    const posts = await fetchPosts();
    if (posts.isErr()) {
      return alert(`failed to fetch: ${posts.unwrapErr()}`);
    }

    for (const post of posts.unwrap()) {
      const component = document.createElement("component-post");
      component.setAttribute("data-__blob", JSON.stringify(post));
      const item = document.createElement("li");
      item.appendChild(component);
      ol.appendChild(item);
    }
  }

  disconnectedCallback() {
    const ol = this.shadowRoot?.querySelector("ol");
    if (typeof ol === "undefined" || ol === null) {
      return alert(`failed to query: ol`);
    }
    ol.innerHTML = "";
  }
}

(async () => {
  (await insertFile(page)).unwrap();
  (await defineComponent("page-home", PageHome)).unwrap();
})();
