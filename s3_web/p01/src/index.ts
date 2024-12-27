import { navigate } from "@/lib/navigate.ts";
import { q } from "@/lib/rustify.ts";

(() => {
  window.addEventListener("unhandledrejection", (e) => {
    e.preventDefault();
    alert(e.reason);
  });
  window.addEventListener("DOMContentLoaded", async (_) => {
    q(await navigate(window.location.pathname));
  });
  window.addEventListener("popstate", async (_) => {
    q(await navigate(window.location.pathname));
  });
})();
