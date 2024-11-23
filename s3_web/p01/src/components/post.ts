import { Err, Ok, Result } from "oxide.ts";

import { AttachmentKind } from "@/data.ts";
import { defineComponent, insertFile, populateNode } from "@/index.ts";

import styles from "@/components/post.module.css" with { type: "css" };

class Post extends HTMLElement {
  constructor() {
    super();
    populateNode(this, "component-post", styles).unwrap();
  }

  connectedCallback() {
    const attachmentSrc = this.getAttribute("data-attachment-src");
    if (attachmentSrc === null) {
      return alert("missing required parameter: attachmentSrc");
    }

    const attachmentType = this.getAttribute("data-attachment-type");
    if (attachmentType === null) {
      return alert("missing required parameter: attachmentType");
    }

    const avatar = this.getAttribute("data-avatar");
    if (avatar === null) {
      return alert("missing required parameter: avatar");
    }

    const handle = this.getAttribute("data-handle");
    if (handle === null) {
      return alert("missing required parameter: handle");
    }

    const text = this.getAttribute("data-text");
    if (text === null) {
      return alert("missing required parameter: text");
    }

    const timestamp = this.getAttribute("data-timestamp");
    if (timestamp === null) {
      return alert("missing required parameter: timestamp");
    }

    const username = this.getAttribute("data-username");
    if (username === null) {
      return alert("missing required parameter: username");
    }

    const [err, val] = this.#render(
      attachmentSrc,
      attachmentType,
      avatar,
      handle,
      text,
      timestamp,
      username,
    ).intoTuple();
    if (err) {
      return alert(`failed to render: ${err}`);
    }
  }

  #render(
    attachmentSrc: string,
    attachmentType: string,
    avatar: string,
    handle: string,
    text: string,
    timestamp: string,
    username: string,
  ): Result<void, Error> {
    {
      const selector = ".avatar";
      const img = this.shadowRoot?.querySelector<HTMLImageElement>(selector);
      if (typeof img === "undefined" || img === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      img.src = avatar;
    }

    {
      const selector = ".username";
      const p = this.shadowRoot?.querySelector<HTMLParagraphElement>(selector);
      if (typeof p === "undefined" || p === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      p.innerText = username;
    }

    {
      const selector = ".handle";
      const small = this.shadowRoot?.querySelector<HTMLElement>(selector);
      if (typeof small === "undefined" || small === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      small.innerText = handle;
    }

    {
      const selector = ".timestamp";
      const small = this.shadowRoot?.querySelector<HTMLElement>(selector);
      if (typeof small === "undefined" || small === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      small.innerText = timestamp;
    }

    {
      const selector = ".text";
      const pre = this.shadowRoot?.querySelector<HTMLElement>(selector);
      if (typeof pre === "undefined" || pre === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }
      pre.innerText = text;
    }

    {
      const selector = ".attachment";
      const div = this.shadowRoot?.querySelector<HTMLDivElement>(selector);
      if (typeof div === "undefined" || div === null) {
        return Err(new Error(`failed to query: ${selector}`));
      }

      switch (attachmentType as AttachmentKind) {
        case "image": {
          const img = document.createElement("img");
          img.src = attachmentSrc;
          div.appendChild(img);
          break;
        }
        case "video": {
          const iframe = document.createElement("iframe");
          iframe.allowFullscreen = true;
          iframe.src = attachmentSrc;
          div.appendChild(iframe);
          break;
        }
        default: {
          return Err(new Error(`unexpected attachment: ${attachmentType}`));
        }
      }
    }

    return Ok(undefined);
  }
}

(async () => {
  (await insertFile("/templates/components/post.html")).unwrap();
  (await defineComponent("component-post", Post)).unwrap();
})();
