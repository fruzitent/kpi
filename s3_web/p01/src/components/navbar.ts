import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/navbar.module.css" with { type: "css" };

class Navbar extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-navbar", styles).unwrap();
  }
}

class NavbarItem extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-navbar-item", styles).unwrap();
  }
}

(async () => {
  (await insertFile("/templates/components/navbar.html")).unwrap();
  (await defineComponent("component-navbar", Navbar)).unwrap();
  (await defineComponent("component-navbar-item", NavbarItem)).unwrap();
})();
