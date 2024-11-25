import { q } from "@/index.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import type { Route } from "@/lib/dto.ts";

import html from "@/pages/messages.html?url";
import css from "@/pages/messages.module.css" with { type: "css" };

export class PageMessages extends HTMLElement {
  static __route: Route = {
    href: "/messages/",
    id: "page-messages",
    name: "Messages",
  };

  constructor() {
    super();
    q(populateNode(this, PageMessages.__route.id, css));
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(PageMessages.__route.id, PageMessages));
})();
