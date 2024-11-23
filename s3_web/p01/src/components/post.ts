import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/post.module.css" with { type: "css" };

class Post extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-post", styles).unwrap();
  }
}

(async () => {
  (await insertFile("/templates/components/post.html")).unwrap();
  (await defineComponent("component-post", Post)).unwrap();
})();
