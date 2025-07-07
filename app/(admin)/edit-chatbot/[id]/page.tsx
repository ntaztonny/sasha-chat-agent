"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useEffect, useState, FormEvent } from "react";
import { BASE_URL } from "@/graphql/apolloClient";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import Avator from "@/components/Avator";
import { useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdResponse, GetChatbotByIdVariables } from "@/types/types";

// function EditChatBot({ params: { id } }: { params: { id: string } }) {
function EditChatBot() {
  const asyncParams = useParams<{ id: string }>();
  const id = asyncParams.id;

  const [url, setUrl] = useState<string>("");
  const [chatbotName, setChatbotName] = useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  const { data, loading, error } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, {
    variables: { id },
  });

  console.log("Chatbotdata", data);

  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name);
      console.log("the chatbotname", chatbotName);
    }
  });

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;
    setUrl(url);
  }, [id]);

  const handleUpdateChatbot = (e: FormEvent) => {
    e.preventDefault();
    console.log("chatbot updated!!!");
  };

  const handleUpdateCharacteristics = (e: FormEvent) => {
    e.preventDefault();
    console.log("chatbot characteristics updated!!!");
  };
  return (
    <div className="px-0 md:p-10">
      <div className="md:sticky md:top-0 z-50 sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2991EE]">
        <h2 className="text-white text-sm font-bold">Link to chat</h2>
        <p className="text-sm italie text-white">
          Share this link with your customers to start conversations with your
          chatbot
        </p>
        <div className="flex items-center space-x-2">
          <Link href={url} className="w-full cursor-pointer hover:opacity-50">
            <Input value={url} readOnly className="cursor-pointer bg-white" />
          </Link>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success("copied to clipboard");
            }}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <section className="relative mt-5 bg-white p-5 md:p-10 rounded-lg">
        <Button
          variant="destructive"
          className="absolute top-2 right-2 h-8 w-2 bg-red-500"
          // onClick={()=> handleDelete(id)}
        >
          X
        </Button>
        <div className="flex space-x-4">
          <Avator seed={chatbotName} />
          <form
            onSubmit={handleUpdateChatbot}
            className="flex flex-1 space-x-2 items-center"
          >
            <Input
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              placeholder={chatbotName}
              className="w-full border-2 bg-transparent text-xl font-bold"
            />
            <Button
              type="submit"
              disabled={!chatbotName}
              className="bg-black text-white"
            >
              Update
            </Button>
          </form>
        </div>
        <h2 className="text-xl font-bold mt-10">
          {" "}
          Heres what your AI knows...
        </h2>
        <p>
          Your chatbpt is equiped with the following information to assis you in
          your conversations with your customers & users
        </p>
        <div>
          <form onSubmit={handleUpdateCharacteristics}>
            <Input
              type="text"
              placeholder="Example: if customer asks for prices, provide pricing page: www.example.com/pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
            />
            <Button
              type="submit"
              disabled={!newCharacteristic}
              className="bg-black text-white"
            >
              Add
            </Button>
          </form>
          <ul>
            {data?.chatbots.chatbot_characteristics.map((characteristic) => (
              <li key={characteristic.id} className="flex">
                <p>{characteristic.content}</p>
                <Button
                  variant="destructive"
                  className="px-3"
                  // onClick={() => handleDeleteCharacteristic(characteristic.id)}
                >
                  X
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EditChatBot;
