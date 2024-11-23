import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/trends.module.css" with { type: "css" };

class Hashtag extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-hashtag", styles).unwrap();
  }
}

class Trends extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-trends", styles).unwrap();
  }
}

(async () => {
  (await insertFile("/templates/components/trends.html")).unwrap();
  (await defineComponent("component-hashtag", Hashtag)).unwrap();
  (await defineComponent("component-trends", Trends)).unwrap();
})();
