import React from "react";
import { auth } from "@clerk/nextjs/server";
import {
  //   GET_CHATBOT_BY_ID,
  //   GET_CHATBOTS_BY_USER,
  GET_USER_CHATBOTS, // gets all chatbots from the DB
} from "@/graphql/queries/queries";
import {
  Chatbot,
  GetChatbotsByUserData,
  GetChatbotsByUserDataVariables,
} from "@/types/types";
import { serverClient } from "@/lib/server/serverClient";
import ChatBotSessions from "@/components/ChatBotSession";

async function ReviewSessions() {
  const { userId } = await auth();

  const { data } = await serverClient.query<
    GetChatbotsByUserData,
    GetChatbotsByUserDataVariables
  >({
    query: GET_USER_CHATBOTS,
    variables: { clerk_user_id: userId },
  });

  /*const sortedChatbotsByUserSession: Chatbot[] = data?.chatbotsList.map(
    (chatbot: Chatbot) => ({
      ...chatbot,
      chat_sessions: [...chatbot.chat_sessions].sort(
        (a: Date, b: Date) => new Date(b.created_at) - new Date(a.created_at)
      ),
    })
  );*/

  const sortedChatbotsByUserSession: Chatbot[] = data?.chatbotsList.sort(
    (a: Date, b: Date) => new Date(b.created_at) - new Date(a.created_at)
  );

  console.log("sortedChatbotsByUserSession", sortedChatbotsByUserSession);
  return (
    <div className="flex-1 px-10">
      <h1 className="text-xl lg:text-3xl font-semibold mt-10">Chat Sessions</h1>
      <h2 className="mb-5">
        {" "}
        Review all the chat sessions the chatbots have had with your customers
      </h2>
      <ChatBotSessions chatbots={sortedChatbotsByUserSession} />
    </div>
  );
}

export default ReviewSessions;
