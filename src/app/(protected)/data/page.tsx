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

      console.log(
        "Movies added successfully! number of new data:",
        data.length
      );
    } catch (error) {
      console.error("Failed to add movies:", error);
    }
  };
  // const handleRefreshDataMetaData = async () => {
  //   try {
  //     console.log("Refresing movies...");
  //     await refreshMoviesMetadata();

  //     console.log("Movies refreshed!");
  //   } catch (error) {
  //     console.error("Failed to add movies:", error);
  //   }
  // };
  // const handleReEmbed = async () => {
  //   try {
  //     console.log("Reembedding movies...");
  //     await refreshMovieEmbedding();
  //     console.log("Reembedded sucessfully!");
  //   } catch (error) {
  //     console.error("Failed to add movies:", error);
  //   }
  // };

  return (
    <section className="pt-24">
      <Button onClick={handleAddData}>Add Movies</Button>
      {/* <Button onClick={handleRefreshDataMetaData}>Refresh Movies</Button> */}
      {/* <Button onClick={handleReEmbed}>Reembedd </Button> */}
    </section>
  );
};

export default Page;
