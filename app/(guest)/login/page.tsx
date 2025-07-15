import React from "react";
import Avator from "@/components/Avator";
import { SignIn } from "@clerk/nextjs";

function LoginPage() {
  return (
    <div className="flex py-10 md:py-0 flex-col flex-1 justify-center items-center bg-[#63B5F5]">
      <div className="grid grid-col-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-center space-y-5 text-white">
          <div className="rounded-full bg-white p-5">
            <Avator seed=" Sasha chatbot Agent" className="h-60 w-60" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl"> Sasha chatbot Agent</h1>
            <h2 className="text-base font-light">
              {" "}
              Create and customize your AI chat Agent
            </h2>
            <h3 className="my-5 font-bold">Sign in to get started</h3>
          </div>
        </div>
        <SignIn routing="hash" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
}

export default LoginPage;
