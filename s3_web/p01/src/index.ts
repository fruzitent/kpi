if (!("content" in document.createElement("template"))) {
  throw new Error("<template> is not supported");
}

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
): ShadowRoot => {
  const template = document.querySelector<HTMLTemplateElement>(selector);
  if (template === null) {
    throw new Error(`failed to query: ${selector}`);
  }
  const shadowRoot = node.attachShadow({ mode: "open" });
  shadowRoot.appendChild(template.content.cloneNode(true));
  return shadowRoot;
};

customElements.define(
  "my-navbar",
  class extends HTMLElement {
    #root: ShadowRoot;

    constructor() {
      super();
      this.#root = populateNode(this, "template#navbar");
    }

    connectedCallback() {
      const selector = "ol";
      const olist = this.#root.querySelector<HTMLOListElement>(selector);
      if (olist === null) {
        throw new Error(`failed to query: ${selector}`);
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
    #root: ShadowRoot;

    constructor() {
      super();
      this.#root = populateNode(this, "template#navbar-item");
    }

    connectedCallback() {
      const selector = "a";
      const anchor = this.#root.querySelector<HTMLAnchorElement>(selector);
      if (anchor === null) {
        throw new Error(`failed to query: ${selector}`);
      }

      const href = this.getAttribute("data-href");
      if (href !== null) {
        anchor.href = href;
      } else {
        throw new Error("missing required parameter: href");
      }

      const title = this.getAttribute("data-title");
      if (title !== null) {
        anchor.innerHTML = title;
      } else {
        throw new Error("missing required parameter: title");
      }
    }
  },
);
