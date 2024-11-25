import { getRoutes } from "@/lib/data.ts";
import { q } from "@/lib/rustify.ts";
import { Err, Result } from "oxide.ts";

export const navigate = async (path: string): Promise<Result<void, Error>> => {
  const root = document.querySelector("#root");
  if (root == null) {
    return Err(Error("failed to query", { cause: "#root" }));
  }

  const url = new URL(path, import.meta.url);
  url.pathname += url.pathname.endsWith("/") ? "" : "/";

  const routes = q(await getRoutes());
  const route = routes.find((r) => r.href === url.pathname);
  if (route === undefined) {
    return Err(Error("failed to find route", { cause: path }));
  }

  return Result.safe(() => root.replaceChildren(document.createElement(route.id)));
};
