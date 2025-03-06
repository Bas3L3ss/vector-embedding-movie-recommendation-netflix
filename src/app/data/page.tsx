"use client";

import { addFilms } from "@/actions/films";
import { Button } from "@/components/ui/button";
import { data } from "@/lib/mockdata";
import React from "react";

const Page = () => {
  const handleAddData = async () => {
    try {
      console.log("Adding movies...");
      await addFilms(data);
      console.log("Movies added successfully!");
    } catch (error) {
      console.error("Failed to add movies:", error);
    }
  };

  return (
    <section className="pt-24">
      <Button onClick={handleAddData}>Add Movies</Button>
    </section>
  );
};

export default Page;
