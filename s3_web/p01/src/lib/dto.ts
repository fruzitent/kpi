import { z } from "zod";

export const AttachmentKindSchema = z.enum(["image", "video"]);
export type AttachmentKind = z.infer<typeof AttachmentKindSchema>;

export const AttachmentSchema = z.object({
  src: z.string(),
  type: AttachmentKindSchema,
});
export type Attachment = z.infer<typeof AttachmentSchema>;

export const TagSchema = z.object({
  data: z.string(),
  pos: z.object({
    x0: z.number(),
    x1: z.number(),
    y0: z.number(),
    y1: z.number(),
  }),
});
export type Tag = z.infer<typeof TagSchema>;

export const PostSchema = z.object({
  attachment: AttachmentSchema,
  avatar: z.string(),
  handle: z.string(),
  tags: z.array(TagSchema),
  text: z.string(),
  timestamp: z.string(),
  username: z.string(),
});
export type Post = z.infer<typeof PostSchema>;

export const RouteSchema = z.object({
  href: z.string(),
  name: z.string(),
  id: z.string(),
});
export type Route = z.infer<typeof RouteSchema>;

export const TrendSchema = z.object({
  category: z.string(),
  hashtag: z.string(),
  posts: z.string(),
});
export type Trend = z.infer<typeof TrendSchema>;
