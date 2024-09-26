import { Err, Ok } from "@/rustify.ts";

import type { Result } from "@/rustify.ts";

export type Page = {
  href: URL;
  title: string;
};

export const isPage = (obj: unknown): obj is Page => {
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

export const isPages = (obj: unknown): obj is Page[] => {
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

export const fetchPages = async (): Promise<Result<Page[], string>> => {
  await new Promise((resolve) => setTimeout(resolve, 420));
  if (Math.random() < 0.1) {
    return Err("internal server error");
  }
  if (!isPages(PAGES)) {
    return Err(`invalid type(Page[]): ${PAGES}`);
  }
  return Ok(PAGES);
};
