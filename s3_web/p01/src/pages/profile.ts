import { defineComponent, insertFile, populateNode } from "@/index.ts";

import page from "@/pages/profile.html?url";
import styles from "@/pages/profile.module.css" with { type: "css" };

class PageProfile extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "page-profile", styles).unwrap();
  }
}

(async () => {
  (await insertFile(page)).unwrap();
  (await defineComponent("page-profile", PageProfile)).unwrap();
})();
