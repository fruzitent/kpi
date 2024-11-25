import { Err, Ok, Result } from "oxide.ts";

import { fetchTrends, Trend, TrendSchema } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/trends.module.css" with { type: "css" };
import component from "./trends.html?url";

class ComponentTrends extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-trends", styles).unwrap();
  }

  async connectedCallback() {
    const ul = this.shadowRoot?.querySelector("ul");
    if (typeof ul === "undefined" || ul === null) {
      return alert(`failed to query: "ul"`);
    }

    const trends = await fetchTrends();
    if (trends.isErr()) {
      return alert(`failed to fetch: ${trends.unwrapErr()}`);
    }

    for (const trend of trends.unwrap()) {
      const component = document.createElement("component-trends-item");
      component.setAttribute("data-__blob", JSON.stringify(trend));
      const item = document.createElement("li");
      item.appendChild(component);
      ul.appendChild(item);
    }
  }

  disconnectedCallback() {
    const ul = this.shadowRoot?.querySelector("ul");
    if (typeof ul === "undefined" || ul === null) {
      return alert(`failed to query: ul`);
    }
    ul.innerHTML = "";
  }
}

class ComponentTrendsItem extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-trends-item", styles).unwrap();
  }

  connectedCallback() {
    const blob = this.getAttribute("data-__blob");
    if (blob === null) {
      return alert("missing required parameter: blob");
    }

    const trend = TrendSchema.safeParse(JSON.parse(blob));
    if (!trend.success) {
      return alert(`failed to parse: ${trend.error.errors}`);
    }

    const [err, val] = this.#render(trend.data).intoTuple();
    if (err) {
      return alert(`failed to render: ${err}`);
    }
  }

  #render(trend: Trend): Result<void, Error> {
    const category = this.shadowRoot?.querySelector<HTMLSpanElement>(".category");
    if (typeof category === "undefined" || category === null) {
      return Err(new Error(`failed to query: .category`));
    }
    category.innerText = trend.category;

    const hashtag = this.shadowRoot?.querySelector<HTMLParagraphElement>(".hashtag");
    if (typeof hashtag === "undefined" || hashtag === null) {
      return Err(new Error(`failed to query: .hashtag`));
    }
    hashtag.innerText = trend.hashtag;

    const posts = this.shadowRoot?.querySelector<HTMLSpanElement>(".posts");
    if (typeof posts === "undefined" || posts === null) {
      return Err(new Error(`failed to query: .posts`));
    }
    posts.innerText = trend.posts;

    return Ok(undefined);
  }
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-trends", ComponentTrends)).unwrap();
  (await defineComponent("component-trends-item", ComponentTrendsItem)).unwrap();
})();
