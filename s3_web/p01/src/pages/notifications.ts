import { defineComponent, insertFile, populateNode } from "@/index.ts";

import page from "@/pages/notifications.html?url";
import styles from "@/pages/notifications.module.css" with { type: "css" };

class Notifications extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "page-notifications", styles).unwrap();
  }
}

(async () => {
  (await insertFile(page)).unwrap();
  (await defineComponent("page-notifications", Notifications)).unwrap();
})();
