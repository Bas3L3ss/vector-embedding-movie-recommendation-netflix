import { cn } from "../../lib/utils";
import React from "react";

const Loading = ({
  size = 46,
  className,
  text,
  classNameInner,
}: {
  size?: number;
  className?: string;
  classNameInner?: string;
  text?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-center py-16 items-center  text-white",
        className
      )}
    >
      <div
        className={cn(
          `animate-spin rounded-full   border-t-2 border-b-2 border-red-600`,
          classNameInner
        )}
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
