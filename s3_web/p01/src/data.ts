import { Err, Ok, Result } from "oxide.ts";

export type Page = {
  href: string;
  title: string;
};

export const isPage = (obj: unknown): obj is Page => {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  if (!("href" in obj) || typeof obj.href !== "string") {
    return false;
  }
  if (!("title" in obj) || typeof obj.title !== "string") {
    return false;
  }
  return true;
};

export const isPages = (obj: unknown): obj is Page[] => {
  return Array.isArray(obj) && obj.every(isPage);
};

const PAGES: readonly Page[] = Object.freeze([
  {
    href: new URL("./pages/i-want-to-be-a-crab", location.href).pathname,
    title: "i want to be a crab",
  },
  {
    href: new URL("./pages/kazuya-precepts", location.href).pathname,
    title: "kazuya precepts",
  },
  {
    href: new URL("./pages/live-better", location.href).pathname,
    title: "live better",
  },
  {
    href: new URL("./pages/lose-the-meaning-of-life", location.href).pathname,
    title: "lose the meaning of life",
  },
  {
    href: new URL("./pages/the-fairy-philosophy", location.href).pathname,
    title: "the fairy philosophy",
  },
]);

export const fetchPages = async (): Promise<Result<Page[], Error>> => {
  await new Promise((resolve) => setTimeout(resolve, 420));
  if (Math.random() < 0.1) {
    return Err(new Error("internal server error"));
  }
  if (!isPages(PAGES)) {
    return Err(new Error(`invalid type(Page[]): ${PAGES}`));
  }
  return Ok(PAGES);
};
