import { Err, Ok } from "oxide.ts";

import type { Result } from "oxide.ts";

import { AttachmentSchema, PostSchema } from "@/lib/dto.ts";
import { q } from "@/lib/rustify.ts";
import { defineComponent, insertFile, populateNode } from "@/lib/webComponents.ts";

import type { Attachment, Post } from "@/lib/dto.ts";

import html from "@/components/post.html?url";
import css from "@/components/post.module.css" with { type: "css" };

export class ComponentPost extends HTMLElement {
  static __id = "component-post";

  constructor() {
    super();
    q(populateNode(this, ComponentPost.__id, css));
  }

  connectedCallback() {
    const blob = this.getAttribute("data-__blob");
    if (blob === null) {
      throw Error("missing required parameter", { cause: "__blob" });
    }

    const post = PostSchema.safeParse(JSON.parse(blob));
    if (!post.success) {
      throw Error("failed to parse", { cause: post.error });
    }

    q(this.#render(post.data));
  }

  #render(post: Post): Result<void, Error> {
    const avatar = this.shadowRoot?.querySelector<HTMLImageElement>(".avatar");
    if (typeof avatar === "undefined" || avatar === null) {
      return Err(Error("failed to query", { cause: ".avatar" }));
    }
    avatar.src = post.avatar;

    const username = this.shadowRoot?.querySelector<HTMLParagraphElement>(".username");
    if (typeof username === "undefined" || username === null) {
      return Err(Error("failed to query", { cause: ".username" }));
    }
    username.innerText = post.username;

    const handle = this.shadowRoot?.querySelector<HTMLElement>(".handle");
    if (typeof handle === "undefined" || handle === null) {
      return Err(Error("failed to query", { cause: ".handle" }));
    }
    handle.innerText = post.handle;

    const timestamp = this.shadowRoot?.querySelector<HTMLElement>(".timestamp");
    if (typeof timestamp === "undefined" || timestamp === null) {
      return Err(Error("failed to query", { cause: ".timestamp" }));
    }
    timestamp.innerText = post.timestamp;

    const text = this.shadowRoot?.querySelector<HTMLPreElement>(".text");
    if (typeof text === "undefined" || text === null) {
      return Err(Error("failed to query", { cause: ".text" }));
    }
    text.innerText = post.text;

    // TODO: XXX
    const _attachment = this.shadowRoot?.querySelector<HTMLDivElement>(".placeholder");
    if (typeof _attachment === "undefined" || _attachment === null) {
      return Err(Error("failed to query", { cause: ".placeholder" }));
    }

    const attachment = document.createElement(ComponentPostAttachment.__id);
    attachment.setAttribute("data-__blob", JSON.stringify(post.attachment));
    _attachment.replaceChildren(attachment);

    if (post.attachment.type !== "image" || post.tags.length === 0) {
      return Ok(undefined);
    }

    const img = attachment.shadowRoot?.querySelector("img");
    if (typeof img === "undefined" || img === null) {
      return Err(Error("failed to query", { cause: "img" }));
    }
    return this.#renderMap(attachment, img, post);
  }

  #renderMap(attachment: HTMLElement, img: HTMLImageElement, post: Post): Result<void, Error> {
    // TODO: XXX
    const _tooltip = attachment.shadowRoot?.querySelector<HTMLDivElement>(".tooltip");
    if (typeof _tooltip === "undefined" || _tooltip === null) {
      return Err(Error("failed to query", { cause: ".tooltip" }));
    }

    const map = document.createElement("map");
    map.name = `${ComponentPost.__id}-map`;
    img.useMap = `#${map.name}`;

    for (const tag of post.tags) {
      const area = document.createElement("area");

      area.addEventListener("mousemove", (e) => {
        const tooltip = document.createElement(ComponentPostTooltip.__id);
        tooltip.setAttribute("data-tag", tag.data);
        _tooltip.replaceChildren(tooltip);

        // TODO: ignores media query
        _tooltip.style.display = "block";

        const bounds = _tooltip.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - bounds.left}px`;
        tooltip.style.top = `${e.clientY - bounds.top}px`;
      });
      area.addEventListener("mouseout", (e) => {
        _tooltip.style.display = "none";
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

export class ComponentPostAttachment extends HTMLElement {
  static __id = "component-post-attachment";

  constructor() {
    super();
    q(populateNode(this, ComponentPostAttachment.__id, css));
  }

  connectedCallback() {
    const blob = this.getAttribute("data-__blob");
    if (blob === null) {
      throw Error("missing required parameter", { cause: "__blob" });
    }

    const attachment = AttachmentSchema.safeParse(JSON.parse(blob));
    if (!attachment.success) {
      throw Error("failed to parse", { cause: attachment.error });
    }

    q(this.#render(attachment.data));
  }

  #render(attachment: Attachment): Result<void, Error> {
    // TODO: XXX
    const div = this.shadowRoot?.querySelector<HTMLDivElement>(".attachment");
    if (typeof div === "undefined" || div === null) {
      return Err(Error("failed to query", { cause: ".attachment" }));
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
        return Err(Error("unexpected attachment type", { cause: attachment.type }));
      }
    }
    return Ok(undefined);
  }
}

export class ComponentPostTooltip extends HTMLElement {
  static __id = "component-post-tooltip";

  constructor() {
    super();
    q(populateNode(this, ComponentPostTooltip.__id, css));
  }

  connectedCallback() {
    const tag = this.getAttribute("data-tag");
    if (tag === null) {
      throw Error("missing required parameter", { cause: "tag" });
    }
    q(this.#render(tag));
  }

  #render(tag: string): Result<void, Error> {
    const p = this.shadowRoot?.querySelector("p");
    if (typeof p === "undefined" || p === null) {
      return Err(Error("failed to query", { cause: "p" }));
    }
    p.innerText = `#${tag}`;
    return Ok(undefined);
  }
}

(async () => {
  q(await insertFile(html));
  q(await defineComponent(ComponentPost.__id, ComponentPost));
  q(await defineComponent(ComponentPostAttachment.__id, ComponentPostAttachment));
  q(await defineComponent(ComponentPostTooltip.__id, ComponentPostTooltip));
})();
