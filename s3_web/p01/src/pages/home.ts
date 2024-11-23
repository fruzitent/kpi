import { POSTS } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/pages/home.module.css" with { type: "css" };

class Home extends HTMLElement {
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
      component.setAttribute("data-attachment-src", post.attachment.src);
      component.setAttribute("data-attachment-type", post.attachment.type);
      component.setAttribute("data-avatar", post.avatar);
      component.setAttribute("data-handle", post.handle);
      component.setAttribute("data-text", post.text);
      component.setAttribute("data-timestamp", post.timestamp);
      component.setAttribute("data-username", post.username);

      const item = document.createElement("li");
      item.appendChild(component);

      olist.appendChild(item);
    }
  }
}

(async () => {
  (await insertFile("/templates/pages/home.html")).unwrap();
  (await defineComponent("page-home", Home)).unwrap();
})();
