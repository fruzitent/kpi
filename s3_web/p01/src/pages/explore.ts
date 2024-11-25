import { q } from "@/index.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import type { Route } from "@/lib/dto.ts";

import html from "@/pages/explore.html?url";
import css from "@/pages/explore.module.css" with { type: "css" };

export class PageExplore extends HTMLElement {
  static __route: Route = {
    href: "/explore/",
    id: "page-explore",
    name: "Explore",
  };

  constructor() {
    super();
    q(populateNode(this, PageExplore.__route.id, css));
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(PageExplore.__route.id, PageExplore));
})();
