import { Err, Ok, Result } from "oxide.ts";

import { Attachment, AttachmentSchema, Post, PostSchema } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import component from "@/components/post.html?url";
import styles from "@/components/post.module.css" with { type: "css" };

class ComponentAttachment extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-attachment", styles).unwrap();
  }

  connectedCallback() {
    const blob = this.getAttribute("data-__blob");
    if (blob === null) {
      return alert("missing required parameter: blob");
    }

    const attachment = AttachmentSchema.safeParse(JSON.parse(blob));
    if (!attachment.success) {
      return alert(`failed to parse: ${attachment.error.message}`);
    }

    const [err, val] = this.#render(attachment.data).intoTuple();
    if (err) {
      return alert(`failed to render: ${err}`);
    }
  }

  #render(attachment: Attachment): Result<void, Error> {
    const selector = ".attachment";
    const div = this.shadowRoot?.querySelector<HTMLDivElement>(selector);
    if (typeof div === "undefined" || div === null) {
      return Err(new Error(`failed to query: ${selector}`));
    }

    switch (attachment.type) {
      case "image": {
        const img = document.createElement("img");
        img.src = attachment.src;
        div.appendChild(img);
        break;
      }
      case "video": {
        const iframe = document.createElement("iframe");
        iframe.allowFullscreen = true;
        iframe.src = attachment.src;
        div.appendChild(iframe);
        break;
      }
      default: {
        return Err(new Error(`unexpected attachment: ${attachment.type}`));
      }
    }

    return Ok(undefined);
  }
}

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
      const selector = ".attachment-placeholder";
      const attachment = this.shadowRoot?.querySelector<HTMLElement>(selector);
      if (typeof attachment === "undefined" || attachment === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }

      const component = document.createElement("component-attachment");
      component.setAttribute("data-__blob", JSON.stringify(post.attachment));
      attachment.replaceChildren(component);

      if (post.attachment.type !== "image") {
        return Ok(undefined);
      }

      const img = component.shadowRoot?.querySelector("img");
      if (typeof img === "undefined" || img === null) {
        return Err(new Error("failed to query: img"));
      }

      return this.#renderMap(component, img, post);
    }
  }

  #renderMap(attachment: HTMLElement, img: HTMLImageElement, post: Post): Result<void, Error> {
    if (post.tags.length === 0) {
      return Ok(undefined);
    }

    const selector = ".tooltip";
    const tooltip = attachment.shadowRoot?.querySelector<HTMLDivElement>(selector);
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

    attachment.shadowRoot?.appendChild(map);
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
  (await defineComponent("component-attachment", ComponentAttachment)).unwrap();
  (await defineComponent("component-post", ComponentPost)).unwrap();
  (await defineComponent("component-tooltip", ComponentTooltip)).unwrap();
})();
