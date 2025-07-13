import Link from "next/link";
import { Button } from "@/components/ui/button";
import Avator from "@/components/Avator";
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
import { auth } from "@clerk/nextjs/server";
import { serverClient } from "@/lib/server/serverClient";

export const dynamic = "force-dynamic";

async function ViewChatbots() {
  const { userId } = await auth();

  if (!userId) return;

  //get the users chatBots.
  const { data } = await serverClient.query<
    GetChatbotsByUserData,
    GetChatbotsByUserDataVariables
  >({
    query: GET_USER_CHATBOTS,
    variables: { clerk_user_id: userId },
  });

  const sortedChatbotsByUser: Chatbot[] = data?.chatbotsList.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  //   const sortedChatbotsByUser = [];
  return (
    <div className="felx-1 pb-20 p-10">
      <h1>Active chatBots</h1>
      {sortedChatbotsByUser.length === 0 && (
        <div>
          <p>
            You have not created any chatbots yet, click on the button below to
            create one
          </p>
          <Link href="/create-chatbot">
            <Button className="bg-[#64B5F5] text-white p-3 rounded-md mt-5">
              Create Chatbot...
            </Button>
          </Link>
        </div>
      )}

      <ul className="flex flex-col space-y-5">
        {sortedChatbotsByUser.map((chatbot) => (
          <Link key={chatbot?.id} href={`/edit-chatbot/${chatbot?.id}`}>
            <li className="relative p-10 border rounded-md max-w-3xl bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Avator seed={chatbot?.name} />
                  <h2 className="text-xl font-bold">{chatbot?.name}</h2>
                </div>
                <p className="absolute top-5 right-5 text-xs text-gray-400">
                  {" "}
                  Created: {new Date(chatbot.created_at).toLocaleString()}
                </p>
              </div>
              <hr className="mt-2" />

              <div className="grid grid-cols-2 gap-10 md:gap-5 p-5">
                <h3 className="italic">Characteristics:</h3>
                <ul className="text-xs">
                  {chatbot.chatbot_characteristics.length === 0 ? (
                    <p> No characteristics added to the chatbot yet</p>
                  ) : (
                    chatbot.chatbot_characteristics.map((characteristic) => (
                      <li
                        className="list-disc break-words"
                        key={characteristic.id}
                      >
                        {characteristic.content}
                      </li>
                    ))
                  )}
                </ul>
                <h3 className="italic"> No of sessions</h3>
                <p>{chatbot.chat_sessions.length}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ViewChatbots;
