import { prisma } from "../db/db";
import { queryChatGpt } from "./openAiWrapper";
import { ChatMessageType } from "@prisma/client";
import { ChatSessionResponseDTO } from "./types/session";

const CHATBOT_STARTING_MSG = "Hello there! How can I help you today?";

export const processMsg = async (macAddress: string, userMsg: string) => {
  const session = await getLatestChatSession(macAddress);
  if (!session) {
    // throw exception
  }

  // else we do the following:
  // 1. insert the user msg in chat_messages table
  // 2. query openai chat completions api with user msg
  // 3. insert openai response in chat_messages table
  // 4. return openai response to user

  if (!userMsg) {
    //throw exception
  }

  await createChatMessage(session.uuid, userMsg, ChatMessageType.USER);
  const chatGptMsg = await queryChatGpt(userMsg);
  await createChatMessage(session.uuid, chatGptMsg, ChatMessageType.BOT);

  return chatGptMsg;
};

export const newChatSession = async (macAddress: string) => {
  const sessionUuid = await createChatSession(macAddress);
  await createChatMessage(
    sessionUuid,
    CHATBOT_STARTING_MSG,
    ChatMessageType.BOT
  );

  return CHATBOT_STARTING_MSG;
};

export const getOrCreateChatSession = async (
  macAddress: string
): Promise<ChatSessionResponseDTO> => {
  const session = await getLatestChatSession(macAddress);
  if (!session) {
    const sessionUuid = await createChatSession(macAddress);
    const firstMessage = await createChatMessage(
      sessionUuid,
      CHATBOT_STARTING_MSG,
      ChatMessageType.BOT
    );
    return {
      uuid: sessionUuid,
      messages: [
        {
          uuid: firstMessage.uuid,
          type: firstMessage.type,
          content: firstMessage.content,
        },
      ],
    };
  }

  const sessionMessages = await getChatSessionMessages(session.uuid);
  return {
    uuid: session.uuid,
    messages: sessionMessages.map((message) => ({
      uuid: message.uuid,
      content: message.content,
      type: message.type,
    })),
  };
};

const getLatestChatSession = async (macAddress: string) => {
  const session = await prisma.chatSession.findFirst({
    where: { mac_address: macAddress },
    orderBy: { created_at: "desc" },
  });

  return session;
};

const getChatSessionMessages = async (sessionUuid: string) => {
  const sessionMessages = await prisma.chatMessage.findMany({
    where: { session_uuid: sessionUuid },
    orderBy: { created_at: "asc" },
  });

  return sessionMessages;
};

const createChatSession = async (macAddress: string) => {
  const session = await prisma.chatSession.create({
    data: {
      mac_address: macAddress,
    },
  });
  return session.uuid;
};

const createChatMessage = async (
  sessionUuid: string,
  msgContent: string,
  msgType: ChatMessageType
) => {
  const { uuid, content, type } = await prisma.chatMessage.create({
    data: {
      session_uuid: sessionUuid,
      content: msgContent,
      type: msgType,
    },
  });

  return { uuid, content, type };
};
