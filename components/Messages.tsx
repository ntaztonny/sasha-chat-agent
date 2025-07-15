"use client";
import { Message } from "@/types/types";
import { usePathname } from "next/navigation";
import Avator from "./Avator";
import { UserCircle } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";

function Messages({
  messages,
  chatbotName,
}: {
  messages: Message[];
  chatbotName: string;
}) {
  const path = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isReviewPage = path.includes("review-sessions");
  return (
    <div className=" flex-1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg">
      {messages.map((message) => {
        const isSender = message.sender !== "user";
        return (
          <div
            key={message.id}
            className={`flex ${isSender ? "justify-start" : "justify-end"} `}
          >
            {isReviewPage && (
              <p className="relative -top-5 text-xs text-gray-300">
                sent{" "}
                {new Date(message.created_at).toLocaleString("en-US", {
                  timeZone: "UTC",
                })}
              </p>
            )}

            <div
              className={`chat-image avatar w-10 h-10 ${!isSender && "mr-4"}`}
            >
              {isSender ? (
                <Avator
                  seed={chatbotName}
                  className="h-12 w-12 bg-white rounded-full border-2 border-[#2991EE]"
                />
              ) : (
                <UserCircle className="text-[#2991EE]" />
              )}
            </div>

            <p
              className={`chat-bubble p-3 rounded-l-3xl rounded-r-lg ${
                isSender
                  ? "chat-bubble-primary bg-[#4D7DFB]  text-white "
                  : "chat-bubble-secondary bg-gray-200 text-gray-700"
              }`}
            >
              {message.content}
            </p>
          </div>
        );
      })}
      <div ref={ref} />
    </div>
  );
}

export default Messages;
