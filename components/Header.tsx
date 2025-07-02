import Link from "next/link";
import React from "react";
import Avator from "./Avator";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

function Header() {
  return (
    <header className="bg-white shadow-sm text-gray-800 flex justify-between p-5 w-full">
      {/* avator */}
      <Link href="/" className="flex items-center text-4xl font-thin">
        <Avator seed="sasha Ai chatBot" />
        <div className="space-y-1">
          <h1> Sasha chatBot</h1>
          <h2 className="text-sm"> Customizable AI agent</h2>
        </div>
      </Link>
      <div className="flex items-center">
        <SignedIn>
          <UserButton showName />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
