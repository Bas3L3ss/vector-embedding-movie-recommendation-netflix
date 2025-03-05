import Loading from "@/components/reusable/loading";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <Loading size={60} text="Please wait" />
    </div>
  );
};

export default LoadingPage;
