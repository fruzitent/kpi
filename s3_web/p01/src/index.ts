import { navigate } from "@/lib/navigate.ts";
import { q } from "@/lib/rustify.ts";

(() => {
  window.addEventListener("unhandledrejection", (e) => {
    e.preventDefault();
    console.error(e.reason);
    alert(e.reason);
  });
  window.addEventListener("DOMContentLoaded", async (e) => {
    q(await navigate(window.location.pathname));
  });
  window.addEventListener("popstate", async (e) => {
    q(await navigate(window.location.pathname));
  });
})();
