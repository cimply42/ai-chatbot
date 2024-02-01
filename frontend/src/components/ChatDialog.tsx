import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReloadIcon } from "@radix-ui/react-icons";
import LoadingBotText from "./LoadingBotText";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import ChatBubbleText from "./ChatBubbleText";
import useChatBotApi from "../hooks/useChatBotApi";

const FormSchema = z.object({
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters long. " })
    .max(300, { message: "Message must be at most 300 characters long." }),
});

export default function ChatDialog() {
  const [isLoadingBotText, setIsLoadingBotText] = useState<boolean>(true);
  const [chatBotMessages, setChatBotMessages] = useState<string[]>([]);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { queryChatBot, startChatBot } = useChatBotApi();

  const onSend = (data: z.infer<typeof FormSchema>) => {
    form.setValue("message", "");
    setUserMessages((prev) => [...prev, data.message]);
    setIsLoadingBotText(true);
  };

  useEffect(() => {
    (async () => {
      //when starting we construct the conversation that the backend provides
      //reason is if user has already started a conversation, we can continue
      //from where they left off
      const data = await startChatBot("blabla");
      const chatBotMsgs = data.messages
        .filter((message) => message.type === "BOT")
        .map((message) => message.content);

      const userMsgs = data.messages
        .filter((message) => message.type === "USER")
        .map((message) => message.content);
      setChatBotMessages(chatBotMsgs);
      setUserMessages(userMsgs);
      setIsLoadingBotText(false);
    })();
  }, [startChatBot]);

  useEffect(() => {
    if (isLoadingBotText && userMessages.length) {
      (async () => {
        const chatBotMsg = await queryChatBot(
          userMessages[userMessages.length - 1]
        );
        setChatBotMessages((prev) => [...prev, chatBotMsg]);
        setIsLoadingBotText(false);
      })();
    }
  }, [isLoadingBotText, userMessages, queryChatBot]);

  useEffect(() => {
    if (isLoadingBotText) {
      const lastMessageItem = messagesContainerRef.current?.lastElementChild;
      if (lastMessageItem) {
        lastMessageItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [isLoadingBotText]);

  return (
    <>
      <div className="w-[300px] h-[500px] flex flex-col justify-between bg-white rounded border border-gray-200 p-3">
        <div ref={messagesContainerRef} className="flex flex-col overflow-auto">
          {chatBotMessages.length &&
            chatBotMessages.map((message, index) => (
              <div key={index} className="flex flex-col gap-5 mb-5">
                <ChatBubbleText text={message} isBotMsg />
                {userMessages.length && userMessages[index] && (
                  <ChatBubbleText text={userMessages[index]} />
                )}
              </div>
            ))}
          {isLoadingBotText && <LoadingBotText />}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSend)} className="mt-auto">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter message"
                      className="text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoadingBotText}
              className="w-[100%]"
            >
              {isLoadingBotText ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait
                </>
              ) : (
                "Send message"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
