import { defineComponent, insertFile, populateNode } from "@/index.ts";

import component from "@/components/header.html?url";
import styles from "@/components/header.module.css" with { type: "css" };

class Header extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-header", styles).unwrap();
  }
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-header", Header)).unwrap();
})();
