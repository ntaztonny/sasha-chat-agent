"use client";

import React, { useEffect, useState } from "react";
import { Chatbot } from "@/types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Avator from "./Avator";
import Link from "next/link";
import ReactTimeago from "react-timeago";

function ChatBotSessions({ chatbots }: { chatbots: Chatbot[] }) {
  const [sortedChatbots, setSortedChatbots] = useState<Chatbot[]>([]);
  useEffect(() => {
    const sortedArray = [...chatbots].sort(
      (a, b) => b.chat_sessions.length - a.chat_sessions.length
    );
    setSortedChatbots(sortedArray);
  }, [chatbots]);

  return (
    <div className="bg-white">
      <Accordion type="single" collapsible>
        {sortedChatbots.map((chatbot) => {
          const hassessions = chatbot.chat_sessions.length > 0;
          return (
            <AccordionItem
              key={chatbot.id}
              value={`item-${chatbot.id}`}
              className="px-10 py-5"
            >
              {hassessions ? (
                <>
                  <AccordionTrigger>
                    <div className="flex text-left items-center w-full">
                      <Avator seed={chatbot.name} className="h-10 w-10 mr-4" />
                      <div className="flex flex-1 justify-between space-x-4">
                        <p className="pr-4 font-bold text-right">
                          {chatbot.name}
                        </p>
                        <p>{chatbot.chat_sessions.length} sessions</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-5 p-5 bg-gray-100 rounded-md">
                    {chatbot.chat_sessions.map((session) => (
                      <Link
                        key={session.id}
                        href={`review-sessions/${session.id}`}
                        className="relative p-10 bg-[#2991EE] text-white rounded-md block"
                      >
                        <p className="text-lg font-bold">
                          {session.guests?.name || "Anonymous"}
                        </p>
                        <p className="text-sm font-light">
                          {session.guests?.email || "No email provided"}
                        </p>
                        <p className="absolute top-5 right-5 text-sm">
                          <ReactTimeago date={new Date(session.created_at)} />
                        </p>
                      </Link>
                    ))}
                  </AccordionContent>
                </>
              ) : (
                <div className="flex justify-between">
                  <div className="flex">
                    <Avator seed={chatbot.name} className="h-10 w-10 mr-4" />
                    <p className="font-semibold">{chatbot?.name}</p>
                  </div>
                  <p className="font-light"> No sessions</p>
                </div>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default ChatBotSessions;
