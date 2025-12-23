import React from "react";
import { CiSearch } from "react-icons/ci";

export default function searchComponent() {
  return (
    <div className="border bg-white flex h-12 rounded-2xl pl-5 items-center pr-2">
      <input placeholder="Szukaj na blogu..." className="h-full w-full outline-none"></input>
      <CiSearch className="cursor-pointer" />
    </div>
  );
}
