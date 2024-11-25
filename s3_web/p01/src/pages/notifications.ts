import { Ok } from "oxide.ts";

import { q } from "@/lib/rustify.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import type { Result } from "oxide.ts";

import type { Route } from "@/lib/dto.ts";

import html from "@/pages/notifications.html?url";
import css from "@/pages/notifications.module.css" with { type: "css" };

export class PageNotifications extends HTMLElement {
  static __route: Route = {
    href: "/notifications/",
    id: "page-notifications",
    name: "Notifications",
  };

  constructor() {
    super();
    q(populateNode(this, PageNotifications.__route.id, css));
  }

  connectedCallback() {
    q(this.#render());
  }

  disconnectedCallback() {}

  #render(): Result<void, Error> {
    return Ok(undefined);
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(PageNotifications.__route.id, PageNotifications));
})();
