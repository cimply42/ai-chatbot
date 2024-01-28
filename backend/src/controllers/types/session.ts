import { ChatMessageResponseDTO } from "./message";

export type ChatSessionResponseDTO = {
  uuid: string;
  messages: ChatMessageResponseDTO[];
};
