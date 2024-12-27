import { q } from "@/lib/rustify.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import html from "@/components/form.html?url";
import css from "@/components/form.module.css" with { type: "css" };

export class ComponentForm extends HTMLElement {
  static __id = "component-form";

  constructor() {
    super();
    q(populateNode(this, ComponentForm.__id, css));
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(ComponentForm.__id, ComponentForm));
})();
