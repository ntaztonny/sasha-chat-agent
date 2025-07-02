import Avator from "@/components/Avator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function CreateChatBot() {
  return (
    <div className="flex flex-col item-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10 ">
      <Avator seed="sasha-chatBot" />
      <div>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">
          Create a new chatbot to assist you in your conversations with your
          customers
        </h2>
        <form className="flex flex-col md:flex-row gap-5 m-5">
          <Input
            type="text"
            required
            placeholder="chatbot name..."
            className="max-w-lg"
          />
          <Button className="bg-black text-white">Create chat bot</Button>
        </form>
      </div>
    </div>
  );
}

export default CreateChatBot;
