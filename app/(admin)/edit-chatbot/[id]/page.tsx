"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useEffect, useState, FormEvent } from "react";
import { BASE_URL } from "@/graphql/apolloClient";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { mockData } from "./data";
import Avator from "@/components/Avator";
import { useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdResponse, GetChatbotByIdVariables } from "@/types/types";
import {
  DELETE_CHATBOT,
  ADD_CHARACTERISTIC,
  UPDATE_CHATBOT,
} from "@/graphql/mutations/mutations";
import Characteristic from "@/components/Characteristic";
import { useMutation } from "@apollo/client";
import { redirect } from "next/navigation";

// function EditChatBot({ params: { id } }: { params: { id: string } }) {
function EditChatBot() {
  const asyncParams = useParams<{ id: string }>();
  const id = Number(asyncParams.id);

  const [url, setUrl] = useState<string>("");
  const [chatbotName, setChatbotName] = useState<string>(" ");
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: ["GetChatbotById"], // Refetch after deleting the chatbot
    awaitRefetchQueries: true,
  });

  const { data, loading, error } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, {
    variables: { id },
  });

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
  });

  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name);
      console.log("the chatbotname", chatbotName);
    }
  }, [data]);

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;
    setUrl(url);
  }, [id]);

  const handleUpdateChatbot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const promise = updateChatbot({
        variables: {
          id: id,
          name: chatbotName,
        },
      });

      toast.promise(promise, {
        loading: "Updating...",
        success: "Chatbot Name successfully updated!",
        error: "Failed to update chatbot",
      });
    } catch (err) {
      console.error("Error when updating chatbotname", err);
    }
  };

  const handleAddCharacteristic = async (content: string) => {
    try {
      const promise = addCharacteristic({
        variables: {
          chatbotId: Number(id),
          content,
          created_at: new Date(),
        },
      });

      toast.promise(promise, {
        loading: "Adding...",
        success: "Information added",
        error: "Failed to add Information",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChatbot = async (id: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this chatbot?"
    );
    if (!isConfirmed) return;

    try {
      const promise = deleteChatbot({ variables: { id } });
      toast.promise(promise, {
        loading: "Deleting ...",
        success: "Chatbot successfully deleted!!",
        error: "Failed to delete chatbot",
      });
    } catch (err) {
      console.error("Error deleting chatbot", err);
      console.log("error failed to delete:", err);
      toast.error("failed to delete chatbot");
    }
  };

  if (loading)
    return (
      <div className="mx-auto animate-spin p-10">
        <Avator seed="Sasha chatbot agent" />
      </div>
    );

  if (error) return <p>Error: {error.message}</p>;

  if (!data?.chatbots) return redirect("/view-chatbots");
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
          onClick={() => handleDeleteChatbot(id)}
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
              required
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
        <div className="bg-gray-200 p-5 md:p-5 rounded-md mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCharacteristic(newCharacteristic);
              setNewCharacteristic("");
            }}
            className="flex space-x-2 my-5"
          >
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
          <ul className="flex flex-wrap-reverse gap-5">
            {data?.chatbots.chatbot_characteristics.map((characteristic) => (
              <Characteristic
                key={characteristic.id}
                characteristic={characteristic}
                className="flex"
              >
                <p>{characteristic.content}</p>
                <Button
                  variant="destructive"
                  className="px-3"
                  // onClick={() => handleDeleteCharacteristic(characteristic.id)}
                >
                  X
                </Button>
              </Characteristic>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EditChatBot;
