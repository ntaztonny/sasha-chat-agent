"use client";
import { ChatbotCharacteristic } from "@/types/types";
import { useMutation } from "@apollo/client";
import { OctagonX } from "lucide-react";
import React from "react";
import { REMOVE_CHARACTERISTIC } from "@/graphql/mutations/mutations";
import { toast } from "sonner";

function Characteristic({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
  children?: React.ReactNode;
  className?: string;
}) {
  const [removeCharacteristics] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });
  const handleRemoveCharacteristic = async () => {
    try {
      await removeCharacteristics({
        variables: {
          characteristicId: characteristic.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <li
      key={characteristic.id}
      className="relative p-10 bg-white border rounded-md"
    >
      {characteristic.content}
      <OctagonX
        className="w-6 h-6 test-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50"
        onClick={() => {
          const promise = handleRemoveCharacteristic();
          toast.promise(promise, {
            loading: "Removing...",
            success: "Characteristic removed",
            error: "Failed to remove characteristic",
          });
        }}
      />
    </li>
  );
}

export default Characteristic;
