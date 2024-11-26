import { Err, Ok, Result } from "oxide.ts";

import { getRoutes } from "@/lib/data.ts";
import { q } from "@/lib/rustify.ts";

export const navigate = async (path: string): Promise<Result<void, Error>> => {
  const root = document.querySelector("#root");
  if (root == null) {
    return Err(new Error("failed to query", { cause: "#root" }));
  }

  const url = new URL(path, import.meta.url);
  url.pathname += url.pathname.endsWith("/") ? "" : "/";

  const routes = q(await getRoutes());
  const route = routes.find((r) => r.href === url.pathname);
  if (route === undefined) {
    return Err(new Error("failed to find route", { cause: path }));
  }

  const page = document.createElement(route.id);
  const [err, _] = Result.safe(() => root.replaceChildren(page)).intoTuple();
  if (err) {
    return Err(new Error("failed to populate", { cause: err }));
  }

  return Ok(undefined);
};
