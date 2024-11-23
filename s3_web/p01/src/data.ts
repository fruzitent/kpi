export type AttachmentKind = "image" | "video";

export type Attachment = {
  src: string;
  type: AttachmentKind;
};

export type Post = {
  attachment: Attachment;
  avatar: string;
  handle: string;
  text: string;
  timestamp: string;
  username: string;
};

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
