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

const isPage = (obj: unknown): obj is Page => {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  if (!("href" in obj && obj.href instanceof URL)) {
    return false;
  }
  if (!("title" in obj) || typeof obj.title !== "string") {
    return false;
  }
  return true;
};

const isPages = (obj: unknown): obj is Page[] => {
  return Array.isArray(obj) && obj.every(isPage);
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

const fetchPages = async (): Promise<Result<Page[], string>> => {
  await new Promise((resolve) => setTimeout(resolve, 420));
  if (Math.random() < 0.1) {
    return Err("internal server error");
  }
  if (!isPages(PAGES)) {
    return Err(`invalid type(Page[]): ${PAGES}`);
  }
  return Ok(PAGES);
};

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

    async connectedCallback() {
      const res = await fetchPages();
      if (!res.ok) {
        return alert(`failed to fetch pages: ${res.error}`);
      }
      this.#render(res.value);
    }

    #render(pages: Page[]) {
      const selector = "ol";
      const olist = this.shadowRoot?.querySelector<HTMLOListElement>(selector);
      if (typeof olist === "undefined" || olist === null) {
        return alert(`failed to query: ${selector}`);
      }

      for (const page of pages) {
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
      const href = this.getAttribute("data-href");
      if (href === null) {
        return alert("missing required parameter: href");
      }

      const title = this.getAttribute("data-title");
      if (title === null) {
        return alert("missing required parameter: title");
      }

      this.#render(href, title);
    }

    #render(href: string, title: string) {
      const selector = "a";
      const anchor =
        this.shadowRoot?.querySelector<HTMLAnchorElement>(selector);
      if (typeof anchor === "undefined" || anchor === null) {
        return alert(`failed to query: ${selector}`);
      }
      anchor.href = href;
      anchor.innerHTML = title;
    }
  },
);
