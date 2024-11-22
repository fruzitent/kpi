import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/layouts/default.module.css" with { type: "css" };

class LayoutDefault extends HTMLElement {
  constructor() {
    super();
    const [err, val] = populateNode(
      this,
      "template#layout-default",
      styles,
    ).intoTuple();
    if (err) {
      alert(`failed to populate node: ${err}`);
      return;
    }
  }
}

(async () => {
  (await insertFile("/templates/layouts/default.html")).unwrap();
  (await defineComponent("my-layout-default", LayoutDefault)).unwrap();
})();
