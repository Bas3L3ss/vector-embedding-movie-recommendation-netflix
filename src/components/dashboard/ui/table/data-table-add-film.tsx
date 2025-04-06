import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const DataTableAddFilm = () => {
  return (
    <Link href={"/data/new"}>
      <Button variant={"outline"}>Add film</Button>
    </Link>
  );
};

export default DataTableAddFilm;
