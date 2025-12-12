export const MediaType = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  OTHER: "other",
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];
