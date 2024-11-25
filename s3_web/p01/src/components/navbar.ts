import { Ok } from "oxide.ts";

import type { Result } from "oxide.ts";

import { navigate, q } from "@/index.ts";
import { getRoutes } from "@/lib/data.ts";
import { RouteSchema } from "@/lib/dto.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import type { Route } from "@/lib/dto.ts";

import html from "@/components/navbar.html?url";
import css from "@/components/navbar.module.css" with { type: "css" };

export class ComponentNavbar extends HTMLElement {
  static __id = "component-navbar";

  constructor() {
    super();
    q(populateNode(this, ComponentNavbar.__id, css));
  }

  async connectedCallback() {
    const ul = this.shadowRoot?.querySelector("ul");
    if (typeof ul === "undefined" || ul === null) {
      throw Error("failed to query", { cause: "ul" });
    }

    const routes = q(await getRoutes());
    for (const route of routes) {
      const item = document.createElement(ComponentNavbarItem.__id);
      item.setAttribute("data-__blob", JSON.stringify(route));
      const li = document.createElement("li");
      li.appendChild(item);
      ul.appendChild(li);
    }
  }
}

export class ComponentNavbarItem extends HTMLElement {
  static __id = "component-navbar-item";

  constructor() {
    super();
    q(populateNode(this, ComponentNavbarItem.__id, css));
  }

  connectedCallback() {
    const blob = this.getAttribute("data-__blob");
    if (blob === null) {
      throw Error("missing required parameter", { cause: "__blob" });
    }

    const route = RouteSchema.safeParse(JSON.parse(blob));
    if (!route.success) {
      throw Error("failed to parse", { cause: route.error });
    }

    q(this.#render(route.data));
  }

  #render(route: Route): Result<void, Error> {
    const a = this.shadowRoot?.querySelector("a");
    if (typeof a === "undefined" || a === null) {
      throw Error("failed to query", { cause: "a" });
    }
    a.addEventListener("click", async (e) => {
      e.preventDefault();
      window.history.pushState(null, "", route.href);
      q(await navigate(route.href));
    });
    a.href = route.href;
    a.innerText = route.name;
    return Ok(undefined);
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(ComponentNavbar.__id, ComponentNavbar));
  q(await defineComponent(ComponentNavbarItem.__id, ComponentNavbarItem));
})();
