import { Err, Ok, Result } from "oxide.ts";
import { z } from "zod";

export const RouterSchema = z.object({
  href: z.string(),
  name: z.string(),
  page: z.instanceof(HTMLElement),
});
export type Route = z.infer<typeof RouterSchema>;

export const ROUTES: readonly Route[] = Object.freeze([
  {
    href: "/",
    name: "Home",
    page: document.createElement("page-home"),
  },
  {
    href: "/explore/",
    name: "Explore",
    page: document.createElement("page-explore"),
  },
  {
    href: "/notifications/",
    name: "Notifications",
    page: document.createElement("page-notifications"),
  },
  {
    href: "/messages/",
    name: "Messages",
    page: document.createElement("page-messages"),
  },
  {
    href: "/profile/",
    name: "Profile",
    page: document.createElement("page-profile"),
  },
]);

export const route = (path: string): Result<void, Error> => {
  const selector = "#root";
  const root = document.querySelector<HTMLDivElement>(selector);
  if (root === null) {
    return Err(new Error(`failed to query: ${selector}`));
  }

  const route = ROUTES.find((r) => r.href === path);
  if (route === undefined) {
    return Err(new Error(`failed to find route: ${path}`));
  }

  const fn0 = () => root.replaceChildren(route.page);
  const [err0, val0] = Result.safe(fn0).intoTuple();
  if (err0) {
    return Err(new Error(`failed to render: ${err0}`));
  }

  return Ok(undefined);
};
