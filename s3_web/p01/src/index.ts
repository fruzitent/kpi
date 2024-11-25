import { navigate } from "@/lib/navigate.ts";
import { q } from "@/lib/rustify.ts";

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
