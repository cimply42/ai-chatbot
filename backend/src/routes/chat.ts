import { Router } from "express";
import * as controller from "../controllers/chat";

export const router = Router();

router.post("/start", controller.startChatSession);
router.post("/message", controller.handleUserMsg);
router.post("/reset", controller.resetConversation);
