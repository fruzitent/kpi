import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/form.module.css" with { type: "css" };

class Form extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-form", styles).unwrap();
  }
}

(async () => {
  (await insertFile("/templates/components/form.html")).unwrap();
  (await defineComponent("component-form", Form)).unwrap();
})();
