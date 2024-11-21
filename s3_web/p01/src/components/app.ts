import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/app.module.css" with { type: "css" };

class App extends HTMLElement {
  constructor() {
    super();
    const res = populateNode(this, "template#app", styles);
    if (!res.ok) {
      alert(`failed to populate node: ${res.error}`);
      return;
    }
  }
}

(async () => {
  await insertFile("/templates/app.html");
  await defineComponent("my-app", App);
})();
