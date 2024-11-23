import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/footer.module.css" with { type: "css" };

class Footer extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-footer", styles).unwrap();
  }
}

(async () => {
  (await insertFile("/templates/components/footer.html")).unwrap();
  (await defineComponent("component-footer", Footer)).unwrap();
})();
