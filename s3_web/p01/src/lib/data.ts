import { Err, Ok } from "oxide.ts";
import { z } from "zod";

import type { Result } from "oxide.ts";
import type { ZodType } from "zod";

import { PostSchema, RouteSchema, TrendSchema } from "@/lib/dto.ts";
import { PageExplore } from "@/pages/explore.ts";
import { PageHome } from "@/pages/home.ts";
import { PageMessages } from "@/pages/messages.ts";
import { PageNotifications } from "@/pages/notifications.ts";
import { PageProfile } from "@/pages/profile.ts";

import type { Post, Route, Trend } from "@/lib/dto.ts";

// TODO: window.__data
export const fetchWithError = async <T>(data: T, schema: ZodType<T>): Promise<Result<T, Error>> => {
  const timeout = Math.floor(Math.random() * 1000);
  await new Promise((resolve) => setTimeout(resolve, timeout));
  if (Math.random() < 0.1) {
    return Err(new Error("internal server error"));
  }
  const type = schema.safeParse(data);
  if (!type.success) {
    return Err(new Error("failed to parse", { cause: type.error }));
  }
  return Ok(type.data);
};

const POSTS: readonly Post[] = Object.freeze([
  {
    attachment: {
      src: "https://youtube.com/embed/bjxkBwTU2Zw",
      type: "video",
    },
    avatar: "/assets/images/shinnipporiacademy324.jpg",
    handle: "@shinnipporiacademy324",
    tags: [],
    text: `
        兄貴誕生日おめでとう！
        そしてありがとう！
      `.trim(),
    timestamp: "7m",
    username: "Shinnippori Academy",
  },
  {
    attachment: {
      src: "/assets/images/Aniki.jpg",
      type: "image",
    },
    avatar: "/assets/images/BillyHerring777.jpg",
    handle: "@BillyHerring777",
    tags: [
      { data: "ビリー・へリントン", pos: { x0: 270, x1: 600, y0: 825, y1: 1005 } },
      { data: "哲学", pos: { x0: 600, x1: 800, y0: 100, y1: 250 } },
    ],
    text: `
        "歪みねぇ人生を生きろ!"
        "Live a life of yugaminee!"

        ~Aniki
      `.trim(),
    timestamp: "16h",
    username: "Billy Herrington",
  },
  {
    attachment: {
      src: "/assets/images/Kazuya.jpg",
      type: "image",
    },
    avatar: "/assets/images/951DannyR.jpg",
    handle: "@951DannyR",
    tags: [],
    text: `
        "おっほっほっほ～ 元気だ( ^ω^)"
        "Oh ho ho ho~ I'm lively! ( ^ω^)"

        ~Kazuya
      `.trim(),
    timestamp: "2d",
    username: "Danny Resko",
  },
]);
export const getPosts = () => fetchWithError(POSTS, z.array(PostSchema));

const ROUTES: readonly Route[] = Object.freeze([
  PageHome.__route,
  PageExplore.__route,
  PageMessages.__route,
  PageNotifications.__route,
  PageProfile.__route,
]);
export const getRoutes = () => fetchWithError(ROUTES, z.array(RouteSchema));

const TRENDS: readonly Trend[] = Object.freeze([
  {
    category: "Trending",
    hashtag: "レスリングシリーズ",
    posts: "40K posts",
  },
  {
    category: "Trending",
    hashtag: "ビリー・へリントン",
    posts: "2687 posts",
  },
  {
    category: "Trending in Japan",
    hashtag: "合作",
    posts: "3979 posts",
  },
  {
    category: "Trending in Japan",
    hashtag: "音ＭＡＤ",
    posts: "20.5K posts",
  },
  {
    category: "Trending",
    hashtag: "哲学",
    posts: "7613 posts",
  },
  {
    category: "Trending in Japan",
    hashtag: "ガチムチメドレーシリーズ",
    posts: "3652 posts",
  },
]);
export const getTrends = () => fetchWithError(TRENDS, z.array(TrendSchema));
