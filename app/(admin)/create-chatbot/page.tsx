"use client";

import Avator from "@/components/Avator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREATE_CHATBOT } from "@/graphql/mutations/mutations";
import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

function CreateChatBot() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [createChatBot, { data, loading, error }] = useMutation(
    CREATE_CHATBOT,
    {
      variables: {
        clerk_user_id: user?.id,
        name,
      },
    }
  );
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await createChatBot();
      setName("");
      router.push(`/edit-chatbot/${data.data.insertChatbot.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return null;
  }
  return (
    <div className="flex flex-col item-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10 ">
      <Avator seed="sasha-chatBot" />
      <div>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">
          Create a new chatbot to assist you in your conversations with your
          customers
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-5 m-5"
        >
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="chatbot name..."
            className="max-w-lg"
          />
          <Button
            type="submit"
            disabled={loading || !name}
            className="bg-black text-white"
          >
            {loading ? "Creating Chatbot.." : "Create Chatbot"}
          </Button>
        </form>
        <p className="text-gray-300 mt-5"> Example: Customer Support Chatbot</p>
      </div>
    </div>
  );
}

export default CreateChatBot;
