import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/app.module.css" with { type: "css" };

class App extends HTMLElement {
  constructor() {
    super();
    const [err, val] = populateNode(this, "template#app", styles).intoTuple();
    if (err) {
      alert(`failed to populate node: ${err}`);
      return;
    }
  }
}

(async () => {
  (await insertFile("/templates/app.html")).unwrap();
  (await defineComponent("my-app", App)).unwrap();
})();
