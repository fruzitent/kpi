import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/pages/home.module.css" with { type: "css" };

class Home extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "page-home", styles).unwrap();
  }
}

(async () => {
  (await insertFile("/templates/pages/home.html")).unwrap();
  (await defineComponent("page-home", Home)).unwrap();
})();
