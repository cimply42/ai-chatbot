import { ChatMessageType } from "@prisma/client";

export type ChatMessageResponseDTO = {
  uuid: string;
  content: string;
  type: ChatMessageType;
};
