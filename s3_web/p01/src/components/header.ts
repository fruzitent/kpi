import { q } from "@/lib/rustify.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import html from "@/components/header.html?url";
import css from "@/components/header.module.css" with { type: "css" };

export class ComponentHeader extends HTMLElement {
  static __id = "component-header";

  constructor() {
    super();
    q(populateNode(this, ComponentHeader.__id, css));
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(ComponentHeader.__id, ComponentHeader));
})();
