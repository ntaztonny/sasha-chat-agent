"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Messages from "@/components/Messages";
import {
  Chatbot,
  GetChatbotByIdResponse,
  MessagesByChatSessionIdResponse,
  Message,
} from "@/types/types";
import { Button } from "@/components/ui/button";
import startNewChat from "@/lib/startNewChat";
import Avator from "@/components/Avator";
import { useQuery } from "@apollo/client";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm, FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
// import { redirect } from "next/navigation";

const formSchema = z.object({
  message: z.string().min(2, "Your Message is too short!"),
});
function ChatbotPage() {
  const asyncParams = useParams<{ id: string }>();
  const id = Number(asyncParams.id);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [chatId, setChatId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  // const [chatbotData, setChatbotData] = useState<Chatbot>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: chatBotData } = useQuery<GetChatbotByIdResponse>(
    GET_CHATBOT_BY_ID,
    {
      variables: { id },
    }
  );

  const {
    loading: loadingQuery,
    error,
    data,
  } = useQuery<MessagesByChatSessionIdResponse>(
    GET_MESSAGES_BY_CHAT_SESSION_ID,
    {
      variables: { id: chatId },
      skip: !chatId,
    }
  );

  useEffect(() => {
    if (data) setMessages(data?.chat_sessions.messages);
  }, [data]);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const chatId = await startNewChat(name, email, id);
    setChatId(chatId);
    setLoading(false);
    setIsOpen(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { message: formMessage } = values;

    const message = formMessage;
    form.reset();

    if (!name || !email) {
      setIsOpen(true);
      setLoading(false);
      return;
    }

    //handle the messages
    if (!message.trim()) return;
  }
  // if (!chatBotData?.chatbots) return redirect("/view-chatbots");

  return (
    <div className="w-full flex bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <form onSubmit={handleInfoSubmit}>
            <DialogHeader>
              <DialogTitle> Lets help you out</DialogTitle>
              <DialogDescription>
                I just need a few details to get started
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Email
                </Label>
                <Input
                  id="username"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={!name || !email || loading}>
                {!loading ? "Continue" : "Loading..."}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
        <div className="pb-4 border-b sticky top-0 z-50 bg-[#4D7DFB] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4">
          <Avator
            seed={chatBotData?.chatbots.name}
            className="h-12 w-12 bg-white rounded-full border-2 border-white"
          />
          <div>
            <h1 className="truncate text-lg">{chatBotData?.chatbots.name}</h1>
            {/* <h1 className="truncate text-lg">Sasha help bot</h1> */}
            <p className="text-sm text-gray-300">
              {" "}
              Typically replies instantly
            </p>
          </div>
        </div>

        <Messages
          messages={messages}
          chatbotName={chatBotData?.chatbots.name}
        />
        <FormProvider {...form}>
          {/* <Form {...form}> */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start sticky bottom-0 z-50 space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md"
          >
            <FormField
              control={form.control}
              name="message"
              render={(field) => (
                <FormItem className="flex-1">
                  <FormLabel hidden> Message</FormLabel>
                  <FormControl>
                    {/* <Input
                      placeholder="Type a message..."
                      {...field}
                      className="p-8"
                    /> */}
                    <Input
                      placeholder="Type your message here..."
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="p-8"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-full"
              // disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Send
            </Button>
          </form>
          {/* </Form> */}
        </FormProvider>
      </div>
    </div>
  );
}

export default ChatbotPage;
