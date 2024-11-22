import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/pages/app.module.css" with { type: "css" };

class PageApp extends HTMLElement {
  constructor() {
    super();
    const [err, val] = populateNode(
      this,
      "template#page-app",
      styles,
    ).intoTuple();
    if (err) {
      alert(`failed to populate node: ${err}`);
      return;
    }
  }
}

(async () => {
  (await insertFile("/templates/pages/app.html")).unwrap();
  (await defineComponent("my-page-app", PageApp)).unwrap();
})();
