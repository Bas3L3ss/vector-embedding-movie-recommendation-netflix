import Loading from "@/components/reusable/loading";
import React from "react";

const LoadingPage = () => {
  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Loading size={45} text="Getting movies" />
    </section>
  );
};

export default LoadingPage;
