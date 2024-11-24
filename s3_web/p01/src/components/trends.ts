import { Err, Ok, Result } from "oxide.ts";

import { Trend, TRENDS, TrendSchema } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/trends.module.css" with { type: "css" };
import component from "./trends.html?url";

class ComponentTrends extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-trends", styles).unwrap();
  }

  connectedCallback() {
    const selector = "ul";
    const ulist = this.shadowRoot?.querySelector(selector);
    if (typeof ulist === "undefined" || ulist === null) {
      return alert(`failed to query: ${selector}`);
    }

    for (const trend of TRENDS) {
      const component = document.createElement("component-trends-item");
      component.setAttribute("data-__blob", JSON.stringify(trend));
      const item = document.createElement("li");
      item.appendChild(component);
      ulist.appendChild(item);
    }
  }

  disconnectedCallback() {
    const selector = "ul";
    const ulist = this.shadowRoot?.querySelector(selector);
    if (typeof ulist === "undefined" || ulist === null) {
      return alert(`failed to query: ${selector}`);
    }
    ulist.innerHTML = "";
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
    {
      const selector = ".category";
      const span = this.shadowRoot?.querySelector<HTMLSpanElement>(selector);
      if (typeof span === "undefined" || span === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      span.innerText = trend.category;
    }

    {
      const selector = ".hashtag";
      const p = this.shadowRoot?.querySelector<HTMLParagraphElement>(selector);
      if (typeof p === "undefined" || p === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      p.innerText = trend.hashtag;
    }

    {
      const selector = ".posts";
      const span = this.shadowRoot?.querySelector<HTMLSpanElement>(selector);
      if (typeof span === "undefined" || span === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      span.innerText = trend.posts;
    }

    return Ok(undefined);
  }
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-trends", ComponentTrends)).unwrap();
  (await defineComponent("component-trends-item", ComponentTrendsItem)).unwrap();
})();
