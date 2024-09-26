if (!("content" in document.createElement("template"))) {
  throw new Error("<template> is not supported");
}

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

type Page = {
  href: URL;
  title: string;
};

const PAGES: readonly Page[] = Object.freeze([
  {
    href: new URL("./pages/i-want-to-be-a-crab", window.location.href),
    title: "i want to be a crab",
  },
  {
    href: new URL("./pages/kazuya-precepts", window.location.href),
    title: "kazuya precepts",
  },
  {
    href: new URL("./pages/live-better", window.location.href),
    title: "live better",
  },
  {
    href: new URL("./pages/lose-the-meaning-of-life", window.location.href),
    title: "lose the meaning of life",
  },
  {
    href: new URL("./pages/the-fairy-philosophy", window.location.href),
    title: "the fairy philosophy",
  },
]);

const populateNode = <
  N extends HTMLElement,
  S extends string, // TODO: keyof HTMLElementTagNameMap
>(
  node: N,
  selector: S,
): Result<void, string> => {
  const template = document.querySelector<HTMLTemplateElement>(selector);
  if (template === null) {
    return Err(`failed to query: ${selector}`);
  }
  node.attachShadow({ mode: "open" });
  node.shadowRoot?.appendChild(template.content.cloneNode(true));
  return Ok(undefined);
};

customElements.define(
  "my-navbar",
  class extends HTMLElement {
    constructor() {
      super();
      const res = populateNode(this, "template#navbar");
      if (!res.ok) {
        alert(`failed to populate node: ${res.error}`);
        return;
      }
    }

    connectedCallback() {
      const selector = "ol";
      const olist = this.shadowRoot?.querySelector<HTMLOListElement>(selector);
      if (typeof olist === "undefined" || olist === null) {
        return alert(`failed to query: ${selector}`);
      }

      for (const page of PAGES) {
        const item = document.createElement("my-navbar-item");
        item.dataset.href = page.href.toString();
        item.dataset.title = page.title;
        olist.appendChild(item);
      }
    }
  },
);

customElements.define(
  "my-navbar-item",
  class extends HTMLElement {
    constructor() {
      super();
      const res = populateNode(this, "template#navbar-item");
      if (!res.ok) {
        alert(`failed to populate node: ${res.error}`);
        return;
      }
    }

    connectedCallback() {
      const selector = "a";
      const anchor =
        this.shadowRoot?.querySelector<HTMLAnchorElement>(selector);
      if (typeof anchor === "undefined" || anchor === null) {
        return alert(`failed to query: ${selector}`);
      }

      const href = this.getAttribute("data-href");
      if (href !== null) {
        anchor.href = href;
      } else {
        return alert("missing required parameter: href");
      }

      const title = this.getAttribute("data-title");
      if (title !== null) {
        anchor.innerHTML = title;
      } else {
        return alert("missing required parameter: title");
      }
    }
  },
);
