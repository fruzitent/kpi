import { Err, Ok, Result } from "oxide.ts";

import { defineComponent, insertFile, populateNode } from "@/index.ts";
import { route, ROUTES } from "@/router.ts";

import component from "@/components/navbar.html?url";
import styles from "@/components/navbar.module.css" with { type: "css" };

class Navbar extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-navbar", styles).unwrap();
  }

  connectedCallback() {
    const selector = "ul";
    const ulist = this.shadowRoot?.querySelector(selector);
    if (typeof ulist === "undefined" || ulist === null) {
      return alert(`failed to query: ${selector}`);
    }

    for (const route of ROUTES) {
      const component = document.createElement("component-navbar-item");
      component.setAttribute("data-href", route.href);
      component.setAttribute("data-name", route.name);

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

class NavbarItem extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-navbar-item", styles).unwrap();
  }

  connectedCallback() {
    const href = this.getAttribute("data-href");
    if (href === null) {
      return alert("missing required parameter: href");
    }

    const name = this.getAttribute("data-name");
    if (name === null) {
      return alert("missing required parameter: name");
    }

    const [err, val] = this.#render(href, name).intoTuple();
    if (err) {
      return alert(`failed to render: ${err}`);
    }
  }

  #render(href: string, name: string): Result<void, Error> {
    const selector = "a";
    const a = this.shadowRoot?.querySelector(selector);
    if (typeof a === "undefined" || a === null) {
      return Err(new Error(`failed to query: ${selector}`));
    }
    a.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState({}, "", href);
      route(href).unwrap();
    });
    a.href = href;
    a.innerText = name;
    return Ok(undefined);
  }
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-navbar", Navbar)).unwrap();
  (await defineComponent("component-navbar-item", NavbarItem)).unwrap();
})();
