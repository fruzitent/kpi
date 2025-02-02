import { q } from "@/lib/rustify.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import type { Route } from "@/lib/dto.ts";

import html from "@/pages/profile.html?url";
import css from "@/pages/profile.module.css" with { type: "css" };

export class PageProfile extends HTMLElement {
  static __route: Route = {
    href: "/profile/",
    id: "page-profile",
    name: "Profile",
  };

  constructor() {
    super();
    q(populateNode(this, PageProfile.__route.id, css));
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(PageProfile.__route.id, PageProfile));
})();
