import { defineComponent, insertFile, populateNode } from "@/index.ts";

import component from "@/components/form.html?url";
import styles from "@/components/form.module.css" with { type: "css" };

class ComponentForm extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-form", styles).unwrap();
  }
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-form", ComponentForm)).unwrap();
})();
