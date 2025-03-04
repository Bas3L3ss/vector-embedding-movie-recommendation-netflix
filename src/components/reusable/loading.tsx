import { cn } from "@/lib/utils";
import React from "react";

const Loading = ({
  size = 46,
  className,
  text,
}: {
  size?: number;
  className?: string;
  text?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-center py-16 items-center ",
        className
      )}
    >
      <div
        className={`animate-spin rounded-full   border-t-2 border-b-2 border-red-600`}
        style={{ width: size, height: size }}
      ></div>
      {text && (
        <h1 className="mt-5 text-sm ">
          {text}
          <span className="bubble-dots ml-1">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </h1>
      )}
    </div>
  );
};

export default Loading;
