import React from "react";
import { createAvatar } from "@dicebear/core";
import { rings } from "@dicebear/collection";
import Image from "next/image";

function Avator({ seed, className }: { seed: string; className?: string }) {
  const avator = createAvatar(rings, { seed });
  const svg = avator.toString();
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    "base64"
  )}`;
  return (
    <Image
      src={dataUrl}
      alt="user avator"
      width={100}
      height={100}
      className={className}
    />
  );
}

export default Avator;
