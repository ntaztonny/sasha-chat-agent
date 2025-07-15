import client from "@/graphql/apolloClient";
import { INSERT_MESSAGE, INSERT_GUEST } from "@/graphql/mutations/mutations";
import { gql } from "@apollo/client";

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
    console.log("guestInsertResult", guestResult);
    const guestId = guestResult.data.insertGuests.id;

    //initialize a new chat session
  } catch (err) {
    console.error("Error starting a new caht", err);
  }
}
