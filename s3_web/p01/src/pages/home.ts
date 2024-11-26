import { ComponentPost } from "@/components/post.ts";
import { getPosts } from "@/lib/data.ts";
import { q } from "@/lib/rustify.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import type { Route } from "@/lib/dto.ts";

import html from "@/pages/home.html?url";
import css from "@/pages/home.module.css" with { type: "css" };

export class PageHome extends HTMLElement {
  static __route: Route = {
    href: "/",
    id: "page-home",
    name: "Home",
  };

  constructor() {
    super();
    q(populateNode(this, PageHome.__route.id, css));
  }

  async connectedCallback() {
    const ol = this.shadowRoot?.querySelector("ol");
    if (typeof ol === "undefined" || ol === null) {
      throw new Error("failed to query", { cause: "ol" });
    }

    const posts = q(await getPosts());
    for (const post of posts) {
      const item = document.createElement(ComponentPost.__id);
      item.setAttribute("data-__blob", JSON.stringify(post));
      const li = document.createElement("li");
      li.appendChild(item);
      ol.appendChild(li);
    }
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(PageHome.__route.id, PageHome));
})();
