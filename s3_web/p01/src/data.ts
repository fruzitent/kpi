import { z } from "zod";

import { fetchWithError } from "@/index.ts";

export const AttachmentKindSchema = z.enum(["image", "video"]);
export type AttachmentKind = z.infer<typeof AttachmentKindSchema>;

export const AttachmentSchema = z.object({
  src: z.string(),
  type: AttachmentKindSchema,
});
export type Attachment = z.infer<typeof AttachmentSchema>;

export const PostSchema = z.object({
  attachment: AttachmentSchema,
  avatar: z.string(),
  handle: z.string(),
  text: z.string(),
  timestamp: z.string(),
  username: z.string(),
});
export type Post = z.infer<typeof PostSchema>;

export const POSTS: readonly Post[] = Object.freeze([
  {
    attachment: {
      src: "https://youtube.com/embed/bjxkBwTU2Zw",
      type: "video",
    },
    avatar: "/assets/images/shinnipporiacademy324.jpg",
    handle: "@shinnipporiacademy324",
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
    text: `
      "おっほっほっほ～ 元気だ( ^ω^)"
      "Oh ho ho ho~ I'm lively! ( ^ω^)"

      ~Kazuya
    `.trim(),
    timestamp: "2d",
    username: "Danny Resko",
  },
]);
export const fetchPosts = () => fetchWithError(POSTS, z.array(PostSchema));

export const TrendSchema = z.object({
  category: z.string(),
  hashtag: z.string(),
  posts: z.string(),
});
export type Trend = z.infer<typeof TrendSchema>;

export const TRENDS: readonly Trend[] = Object.freeze([
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
export const fetchTrends = () => fetchWithError(TRENDS, z.array(TrendSchema));
