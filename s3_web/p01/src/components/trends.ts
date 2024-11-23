import { Err, Ok, Result } from "oxide.ts";

import { TRENDS } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/trends.module.css" with { type: "css" };

class Trends extends HTMLElement {
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
      component.setAttribute("data-category", trend.category);
      component.setAttribute("data-hashtag", trend.hashtag);
      component.setAttribute("data-posts", trend.posts);

      const item = document.createElement("li");
      item.appendChild(component);

      ulist.appendChild(item);
    }
  }
}

class TrendsItem extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-trends-item", styles).unwrap();
  }

  connectedCallback() {
    const category = this.getAttribute("data-category");
    if (category === null) {
      return alert("missing required parameter: category");
    }

    const hashtag = this.getAttribute("data-hashtag");
    if (hashtag === null) {
      return alert("missing required parameter: hashtag");
    }

    const posts = this.getAttribute("data-posts");
    if (posts === null) {
      return alert("missing required parameter: posts");
    }

    const [err, val] = this.#render(category, hashtag, posts).intoTuple();
    if (err) {
      return alert(`failed to render: ${err}`);
    }
  }

  #render(
    category: string,
    hashtag: string,
    posts: string,
  ): Result<void, Error> {
    {
      const selector = ".category";
      const span = this.shadowRoot?.querySelector<HTMLSpanElement>(selector);
      if (typeof span === "undefined" || span === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      span.innerText = category;
    }

    {
      const selector = ".hashtag";
      const p = this.shadowRoot?.querySelector<HTMLParagraphElement>(selector);
      if (typeof p === "undefined" || p === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      p.innerText = hashtag;
    }

    {
      const selector = ".posts";
      const span = this.shadowRoot?.querySelector<HTMLSpanElement>(selector);
      if (typeof span === "undefined" || span === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      span.innerText = posts;
    }

    return Ok(undefined);
  }
}

(async () => {
  (await insertFile("/templates/components/trends.html")).unwrap();
  (await defineComponent("component-trends", Trends)).unwrap();
  (await defineComponent("component-trends-item", TrendsItem)).unwrap();
})();