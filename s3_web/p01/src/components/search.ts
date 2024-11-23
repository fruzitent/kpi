import { defineComponent, insertFile, populateNode } from "@/index.ts";

import component from "@/components/search.html?url";
import styles from "@/components/search.module.css" with { type: "css" };

class Search extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-search", styles).unwrap();
  }
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-search", Search)).unwrap();
})();
