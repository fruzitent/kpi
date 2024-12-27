import { Err, Ok } from "oxide.ts";

import type { Result } from "oxide.ts";

import { getTrends } from "@/lib/data.ts";
import { TrendSchema } from "@/lib/dto.ts";
import { q } from "@/lib/rustify.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import type { Trend } from "@/lib/dto.ts";

import html from "@/components/trends.html?url";
import css from "@/components/trends.module.css" with { type: "css" };

export class ComponentTrends extends HTMLElement {
  static __id = "component-trends";

  constructor() {
    super();
    q(populateNode(this, ComponentTrends.__id, css));
  }

  async connectedCallback() {
    const ul = this.shadowRoot?.querySelector("ul");
    if (typeof ul === "undefined" || ul === null) {
      throw new Error("failed to query", { cause: "ul" });
    }

    const trends = q(await getTrends());
    for (const trend of trends) {
      const item = document.createElement(ComponentTrendsItem.__id);
      item.setAttribute("data-__blob", JSON.stringify(trend));
      const li = document.createElement("li");
      li.appendChild(item);
      ul.appendChild(li);
    }
  }
}

export class ComponentTrendsItem extends HTMLElement {
  static __id = "component-trends-item";

  constructor() {
    super();
    q(populateNode(this, ComponentTrendsItem.__id, css));
  }

  connectedCallback() {
    const blob = this.getAttribute("data-__blob");
    if (blob === null) {
      throw new Error("missing required parameter", { cause: "__blob" });
    }

    const trend = TrendSchema.safeParse(JSON.parse(blob));
    if (!trend.success) {
      throw new Error("failed to parse", { cause: trend.error });
    }

    q(this.#render(trend.data));
  }

  #render(trend: Trend): Result<void, Error> {
    const category = this.shadowRoot?.querySelector<HTMLSpanElement>(".category");
    if (typeof category === "undefined" || category === null) {
      return Err(new Error("failed to query", { cause: ".category" }));
    }
    category.innerText = trend.category;

    const hashtag = this.shadowRoot?.querySelector<HTMLParagraphElement>(".hashtag");
    if (typeof hashtag === "undefined" || hashtag === null) {
      return Err(new Error("failed to query", { cause: ".hashtag" }));
    }
    hashtag.innerText = trend.hashtag;

    const posts = this.shadowRoot?.querySelector<HTMLSpanElement>(".posts");
    if (typeof posts === "undefined" || posts === null) {
      return Err(new Error("failed to query", { cause: ".posts" }));
    }
    posts.innerText = trend.posts;

    return Ok(undefined);
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(ComponentTrends.__id, ComponentTrends));
  q(await defineComponent(ComponentTrendsItem.__id, ComponentTrendsItem));
})();
