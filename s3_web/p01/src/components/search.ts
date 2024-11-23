import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/search.module.css" with { type: "css" };

class Search extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-search", styles).unwrap();
  }
}

(async () => {
  (await insertFile("/templates/components/search.html")).unwrap();
  (await defineComponent("component-search", Search)).unwrap();
})();
