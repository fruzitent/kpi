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
}

(async () => {
  (await insertFile(component)).unwrap();
  (await defineComponent("component-post", ComponentPost)).unwrap();
})();
