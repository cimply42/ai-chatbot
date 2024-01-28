import axios from "axios";
import { useCallback } from "react";
import { z } from "zod";

export const StartChatBotSchema = z.object({
  uuid: z.string().uuid(),
  messages: z.array(
    z.object({
      uuid: z.string().uuid(),
      content: z.string(),
      type: z.enum(["BOT", "USER"]),
    })
  ),
});

export default function useChatBotApi() {
  const startChatBot = useCallback(async (macAddress: string) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_CHATBOT_SERVICE_URL}/chatbot/start`,
        {
          macAddress,
        }
      );

      if (res.status === 200) {
        const parsedData = StartChatBotSchema.safeParse(res.data);
        if (parsedData.success) {
          return parsedData.data;
        }

        throw Error(
          "Starting Chatbot conversation failed repoonse type validation"
        );
      }
      throw Error(
        "Error while starting Chat Bot conversation. Please try again later..."
      );
    } catch (error) {
      console.log(`Error while starting chat bot. ${error}`);
      throw Error(
        "Error while starting Chat Bot conversation. Please try again later..."
      );
    }
  }, []);

  const queryChatBot = useCallback(async (userMsg: string): Promise<string> => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_CHATBOT_SERVICE_URL}/chatbot/message`,
        {
          message: userMsg,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        return res.data?.message;
      } else if (res.status === 400 || res.status === 404) {
        return "Invalid arguments passed to chatbot. Please try again with different parameters.";
      } else {
        return "Error while retrieving Chat Bot response. Please try again later...";
      }
    } catch (error) {
      console.log(`Error while querying chat bot. ${error}`);
      return "Error while retrieving Chat Bot response. Please try again later...";
    }
  }, []);

  return { queryChatBot, startChatBot };
}
