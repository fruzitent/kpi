import { q } from "@/index.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import html from "@/components/search.html?url";
import css from "@/components/search.module.css" with { type: "css" };

export class ComponentSearch extends HTMLElement {
  static __id = "component-search";

  constructor() {
    super();
    q(populateNode(this, ComponentSearch.__id, css));
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(ComponentSearch.__id, ComponentSearch));
})();
