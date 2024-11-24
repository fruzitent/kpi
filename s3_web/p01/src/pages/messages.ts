import { defineComponent, insertFile, populateNode } from "@/index.ts";

import page from "@/pages/messages.html?url";
import styles from "@/pages/messages.module.css" with { type: "css" };

class Messages extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "page-messages", styles).unwrap();
  }
}

(async () => {
  (await insertFile(page)).unwrap();
  (await defineComponent("page-messages", Messages)).unwrap();
})();
