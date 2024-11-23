import { defineComponent, insertFile, populateNode } from "@/index.ts";

import layout from "@/layouts/default.html?url";
import styles from "@/layouts/default.module.css" with { type: "css" };

class Default extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "layout-default", styles).unwrap();
  }
}

(async () => {
  (await insertFile(layout)).unwrap();
  (await defineComponent("layout-default", Default)).unwrap();
})();
