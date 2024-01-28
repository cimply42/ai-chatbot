import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../constants";
import {
  getOrCreateChatSession,
  newChatSession,
  processMsg,
} from "./chatProcessor";

export const startChatSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { macAddress } = req.body;
    const chatSessionResponse = await getOrCreateChatSession(macAddress);
    if (chatSessionResponse) {
      return res.status(HttpStatusCode.OK).send(chatSessionResponse);
    }

    return res
      .status(HttpStatusCode.SERVER_ERROR)
      .send({ error: "Unknown server error occurred..." });
  } catch (error) {
    next(error);
  }
};

export const handleUserMsg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { macAddress, message } = req.body;
    const chatResponse = await processMsg(macAddress, message);
    if (chatResponse) {
      return res.status(HttpStatusCode.OK).send({ message: chatResponse });
    }

    return res
      .status(HttpStatusCode.SERVER_ERROR)
      .send({ error: "Unknown server error occurred..." });
  } catch (error) {
    next(error);
  }
};

export const resetConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { macAddress } = req.body;
    const chatInitialResponse = await newChatSession(macAddress);
    if (chatInitialResponse) {
      return res
        .status(HttpStatusCode.OK)
        .send({ message: chatInitialResponse });
    }

    return res
      .status(HttpStatusCode.SERVER_ERROR)
      .send({ error: "Unknown server error occurred..." });
  } catch (error) {
    next(error);
  }
};
