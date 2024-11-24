import { defineComponent, insertFile, populateNode } from "@/index.ts";

import component from "@/components/footer.html?url";
import styles from "@/components/footer.module.css" with { type: "css" };

class ComponentFooter extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-footer", styles).unwrap();
  }
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-footer", ComponentFooter)).unwrap();
})();
