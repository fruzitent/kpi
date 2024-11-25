import { Err, Ok, Result } from "oxide.ts";

import { Post, PostSchema } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import component from "@/components/post.html?url";
import styles from "@/components/post.module.css" with { type: "css" };

class ComponentPost extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-post", styles).unwrap();
  }

  connectedCallback() {
    const blob = this.getAttribute("data-__blob");
    if (blob === null) {
      return alert("missing required parameter: blob");
    }

    const post = PostSchema.safeParse(JSON.parse(blob));
    if (!post.success) {
      return alert(`failed to parse: ${post.error.message}`);
    }

    const [err, val] = this.#render(post.data).intoTuple();
    if (err) {
      return alert(`failed to render: ${err}`);
    }
  }

  #render(post: Post): Result<void, Error> {
    {
      const selector = ".avatar";
      const img = this.shadowRoot?.querySelector<HTMLImageElement>(selector);
      if (typeof img === "undefined" || img === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      img.src = post.avatar;
    }

    {
      const selector = ".username";
      const p = this.shadowRoot?.querySelector<HTMLParagraphElement>(selector);
      if (typeof p === "undefined" || p === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      p.innerText = post.username;
    }

    {
      const selector = ".handle";
      const small = this.shadowRoot?.querySelector<HTMLElement>(selector);
      if (typeof small === "undefined" || small === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      small.innerText = post.handle;
    }

    {
      const selector = ".timestamp";
      const small = this.shadowRoot?.querySelector<HTMLElement>(selector);
      if (typeof small === "undefined" || small === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      small.innerText = post.timestamp;
    }

    {
      const selector = ".text";
      const pre = this.shadowRoot?.querySelector<HTMLElement>(selector);
      if (typeof pre === "undefined" || pre === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      pre.innerText = post.text;
    }

    {
      const selector = ".attachment";
      const div = this.shadowRoot?.querySelector<HTMLDivElement>(selector);
      if (typeof div === "undefined" || div === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }

      switch (post.attachment.type) {
        case "image": {
          const img = document.createElement("img");
          img.src = post.attachment.src;
          div.appendChild(img);

          const [err, val] = this.#renderMap(post, img, div).intoTuple();
          if (err) {
            return Err(new Error(`failed to render map: ${err}`));
          }

          break;
        }
        case "video": {
          const iframe = document.createElement("iframe");
          iframe.allowFullscreen = true;
          iframe.src = post.attachment.src;
          div.appendChild(iframe);
          break;
        }
        default: {
          return Err(new Error(`unexpected attachment: ${post.attachment.type}`));
        }
      }
    }

    return Ok(undefined);
  }

  #renderMap(post: Post, img: HTMLImageElement, div: HTMLDivElement): Result<void, Error> {
    if (post.tags.length === 0) {
      return Ok(undefined);
    }

    const selector = ".tooltip";
    const tooltip = this.shadowRoot?.querySelector<HTMLDivElement>(selector);
    if (typeof tooltip === "undefined" || tooltip === null) {
      return Err(new Error(`failed to query: ${selector}`));
    }

    const map = document.createElement("map");
    map.name = "tooltip-map";
    img.useMap = `#${map.name}`;

    for (const tag of post.tags) {
      const area = document.createElement("area");

      area.addEventListener("mousemove", (e) => {
        const component = document.createElement("component-tooltip");
        component.setAttribute("data-tag", tag.data);
        tooltip.replaceChildren(component);

        // TODO: ignores media query
        tooltip.style.display = "block";

        const bounds = tooltip.getBoundingClientRect();
        component.style.left = `${e.clientX - bounds.left}px`;
        component.style.top = `${e.clientY - bounds.top}px`;
      });
      area.addEventListener("mouseout", (e) => {
        tooltip.style.display = "none";
      });

      img.addEventListener("load", (e) => {
        const x0 = Math.floor(tag.pos.x0 * (img.width / img.naturalWidth));
        const x1 = Math.floor(tag.pos.x1 * (img.width / img.naturalWidth));
        const y0 = Math.floor(tag.pos.y0 * (img.height / img.naturalHeight));
        const y1 = Math.floor(tag.pos.y1 * (img.height / img.naturalHeight));
        area.coords = `${x0},${y0},${x1},${y1}`;
        area.shape = "rect";
      });

      area.alt = tag.data;
      map.appendChild(area);
    }

    div.appendChild(map);
    return Ok(undefined);
  }
}

class ComponentTooltip extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-tooltip", styles).unwrap();
  }

  connectedCallback() {
    const tag = this.getAttribute("data-tag");
    if (tag === null) {
      return alert("missing required parameter: tag");
    }

    const [err, val] = this.#render(tag).intoTuple();
    if (err) {
      return alert(`failed to render: ${err}`);
    }
  }

  #render(tag: string): Result<void, Error> {
    const selector = "p";
    const p = this.shadowRoot?.querySelector(selector);
    if (typeof p === "undefined" || p === null) {
      return Err(new Error(`failed to query: ${selector}`));
    }
    p.innerText = `#${tag}`;
    return Ok(undefined);
  }
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-post", ComponentPost)).unwrap();
  (await defineComponent("component-tooltip", ComponentTooltip)).unwrap();
})();
