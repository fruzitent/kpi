import { defineComponent, insertFile, populateNode } from "@/index.ts";

import page from "@/pages/explore.html?url";
import styles from "@/pages/explore.module.css" with { type: "css" };

class Explore extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "page-explore", styles).unwrap();
  }
}

(async () => {
  (await insertFile(page)).unwrap();
  (await defineComponent("page-explore", Explore)).unwrap();
})();
