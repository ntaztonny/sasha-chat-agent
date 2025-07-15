import client from "@/graphql/apolloClient";
import {
  INSERT_MESSAGE,
  INSERT_GUEST,
  INSERT_CHAT_SESSION,
} from "@/graphql/mutations/mutations";
// import { gql } from "@apollo/client";

export async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  try {
    //create a new guest entry
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: { name: guestName, email: guestEmail, created_at: new Date() },
    });
    const guestId = guestResult.data.insertGuests.id;

    //initialize a new chat session
    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        created_at: new Date(),
        chatbot_id: chatbotId,
        guest_id: guestId,
      },
    });

    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

    // insert initial message
    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        content: `Welcome ${guestName}! \n How can I assist you today?`,
        created_at: new Date(),
        sender: "ai",
      },
    });

    console.log("New chat session successfully created!!");

    return chatSessionId;
  } catch (err) {
    console.error("Error starting a new chat", err);
  }
}

export default startNewChat;
