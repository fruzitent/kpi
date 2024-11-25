import { Err, match, Result } from "oxide.ts";

import { getRoutes } from "@/lib/data.ts";

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

export const q = <T, E>(result: Result<T, E>): T => {
  return match(result, {
    Err: (err) => {
      throw Error("failed to unwrap", { cause: err });
    },
    Ok: (val) => val,
  });
};

(() => {
  window.addEventListener("error", (e) => {
    e.preventDefault();
    console.error(e.error);
    alert(e.error);
  });
  window.addEventListener("DOMContentLoaded", async (e) => {
    q(await navigate(window.location.pathname));
  });
  window.addEventListener("popstate", async (e) => {
    q(await navigate(window.location.pathname));
  });
})();
