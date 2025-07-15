import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  GetChatbotByIdResponse,
  MessagesByChatSessionIdResponse,
} from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPEN_APIKEY,
});

export async function POST(req: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();
  console.log(
    `Received message from chat session ${chat_session_id}: ${content} (chatbot: ${chatbot_id})`
  );

  try {
    // fetch chatbot characteristics
    const { data } = await serverClient.query<GetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });

    const chatbot = data?.chatbots;

    if (!chatbot)
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });

    //Fetch previous chats
    const { data: messagesData } =
      await serverClient.query<MessagesByChatSessionIdResponse>({
        query: GET_MESSAGES_BY_CHAT_SESSION_ID,
        variables: { chat_session_id },
        fetchPolicy: "no-cache",
      });
    const previousMessages = messagesData?.chat_sessions.messages;

    const formattedPreviousMessges: ChatCompletionMessageParam[] =
      previousMessages.map((message) => ({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender === "ai" ? "system" : name,
        content: message.content,
      }));

    // combine characteristics into a system prompt
    const systemPrompt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join("+");
    console.log(systemPrompt);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant to ${name}. If a generatic question is asked which is not relevant or in the same scope or domain as the points in mentioned in the key information section, kindly inform the user they are only allowed to search for specific content. Use Emojis where possible. Here is some key information that you need to be aware of, these are elements you may be asked about: ${systemPrompt} `,
      },
      ...formattedPreviousMessges,
      {
        role: "user",
        name: name,
        content: content,
      },
    ];
    // Send to openAi's completion API

    const openaiResponse = await openai.chat.completions.create({
      messages: messages,
      // model: "gpt-3.5-turbo",
      model: "gpt-4o", // if this fails, try using the previous gpt models
    });

    const aiResponse = openaiResponse?.choices?.[0]?.message?.content?.trim();

    //make sur you have an ai response
    if (!aiResponse) {
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }

    //***********Store messages in the DB***************/
    //1---> save user's message into the DB
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content,
        created_at: new Date(),
        sender: "user",
      },
    });
    //2---> save ai's message into the DB
    const aiMessageResponse = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content: aiResponse,
        created_at: new Date(),
        sender: "user",
      },
    });

    //Finally return response to the USER
    return NextResponse.json({
      id: aiMessageResponse?.data?.insertMessages.id,
      content: aiResponse,
    });

    /******** */
  } catch (error) {
    console.error("Error sending message", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
