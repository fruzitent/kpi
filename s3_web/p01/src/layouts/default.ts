import { q } from "@/lib/rustify.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import html from "@/layouts/default.html?url";
import css from "@/layouts/default.module.css" with { type: "css" };

export class LayoutDefault extends HTMLElement {
  static __id = "layout-default";

  constructor() {
    super();
    q(populateNode(this, LayoutDefault.__id, css));
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(LayoutDefault.__id, LayoutDefault));
})();
