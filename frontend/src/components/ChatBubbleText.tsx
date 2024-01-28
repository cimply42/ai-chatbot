interface ChatBubbleTextProps {
  text: string;
  isBotMsg?: boolean;
}

export default function ChatBubbleText({
  text,
  isBotMsg,
}: ChatBubbleTextProps) {
  return (
    <>
      <div
        className={`w-[200px] bg-gray-100 rounded-xl p-3 ${
          isBotMsg ? "mr-auto" : "ml-auto"
        }`}
      >
        <p
          className={`text-black text-sm text-left leading-none break-word ${
            isBotMsg ? "font-medium" : ""
          }`}
        >
          {text}
        </p>
      </div>
    </>
  );
}
