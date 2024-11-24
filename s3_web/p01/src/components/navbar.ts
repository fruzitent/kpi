import { Err, Ok, Result } from "oxide.ts";

import { defineComponent, insertFile, populateNode } from "@/index.ts";
import { fetchRoutes, navigate, Route, RouterSchema } from "@/router.ts";

import component from "@/components/navbar.html?url";
import styles from "@/components/navbar.module.css" with { type: "css" };

class ComponentNavbar extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-navbar", styles).unwrap();
  }

  async connectedCallback() {
    const selector = "ul";
    const ulist = this.shadowRoot?.querySelector(selector);
    if (typeof ulist === "undefined" || ulist === null) {
      return alert(`failed to query: ${selector}`);
    }

    const routes = await fetchRoutes();
    if (routes.isErr()) {
      return alert(`failed to fetch: ${routes.unwrapErr()}`);
    }

    for (const route of routes.unwrap()) {
      const component = document.createElement("component-navbar-item");
      component.setAttribute("data-__blob", JSON.stringify(route));
      const item = document.createElement("li");
      item.appendChild(component);
      ulist.appendChild(item);
    }
  }

  disconnectedCallback() {
    const selector = "ul";
    const ulist = this.shadowRoot?.querySelector(selector);
    if (typeof ulist === "undefined" || ulist === null) {
      return alert(`failed to query: ${selector}`);
    }
    ulist.innerHTML = "";
  }
}

class ComponentNavbarItem extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-navbar-item", styles).unwrap();
  }

  connectedCallback() {
    const blob = this.getAttribute("data-__blob");
    if (blob === null) {
      return alert("missing required parameter: blob");
    }

    const route = RouterSchema.safeParse(JSON.parse(blob));
    if (!route.success) {
      return alert(`failed to parse: ${route.error.message}`);
    }

    const [err, val] = this.#render(route.data).intoTuple();
    if (err) {
      return alert(`failed to render: ${err}`);
    }
  }

  #render(route: Route): Result<void, Error> {
    const selector = "a";
    const a = this.shadowRoot?.querySelector(selector);
    if (typeof a === "undefined" || a === null) {
      return Err(new Error(`failed to query: ${selector}`));
    }
    a.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState({}, "", route.href);
      navigate(route.href).unwrap();
    });
    a.href = route.href;
    a.innerText = route.name;
    return Ok(undefined);
  }
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-navbar", ComponentNavbar)).unwrap();
  (await defineComponent("component-navbar-item", ComponentNavbarItem)).unwrap();
})();
