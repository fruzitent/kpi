import { q } from "@/lib/rustify.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import html from "@/components/footer.html?url";
import css from "@/components/footer.module.css" with { type: "css" };

export class ComponentFooter extends HTMLElement {
  static __id = "component-footer";

  constructor() {
    super();
    q(populateNode(this, ComponentFooter.__id, css));
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(ComponentFooter.__id, ComponentFooter));
})();
