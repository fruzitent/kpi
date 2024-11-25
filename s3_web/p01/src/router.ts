import { Err, Ok, Result } from "oxide.ts";
import { z } from "zod";

import { fetchWithError } from "@/index.ts";

export const RouterSchema = z.object({
  href: z.string(),
  name: z.string(),
  page: z.string(),
});
export type Route = z.infer<typeof RouterSchema>;

export const ROUTES: readonly Route[] = Object.freeze([
  {
    href: "/",
    name: "Home",
    page: "page-home",
  },
  {
    href: "/explore/",
    name: "Explore",
    page: "page-explore",
  },
  {
    href: "/notifications/",
    name: "Notifications",
    page: "page-notifications",
  },
  {
    href: "/messages/",
    name: "Messages",
    page: "page-messages",
  },
  {
    href: "/profile/",
    name: "Profile",
    page: "page-profile",
  },
]);
export const fetchRoutes = () => fetchWithError(ROUTES, z.array(RouterSchema));

export const navigate = (path: string): Result<void, Error> => {
  const root = document.querySelector<HTMLDivElement>("#root");
  if (root === null) {
    return Err(new Error(`failed to query: #root`));
  }

  const route = ROUTES.find((r) => r.href === path);
  if (route === undefined) {
    return Err(new Error(`failed to find route: ${path}`));
  }

  const fn0 = () => root.replaceChildren(document.createElement(route.page));
  const [err0, val0] = Result.safe(fn0).intoTuple();
  if (err0) {
    return Err(new Error(`failed to render: ${err0}`));
  }

  return Ok(undefined);
};
