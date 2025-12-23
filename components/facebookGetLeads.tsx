"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { env } from "process";

export default function FacebookGetLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchLeads = async () => {
    console.log("start");
    try {
      const response = await axios.get("/api/leads/leads"); // Wywołanie endpointu API w aplikacji
      console.log(response.data);
      setLeads(response.data.leads);
    } catch (error) {
      setError("Nie udało się pobrać danych.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div
        onClick={fetchLeads}
        className="mx-[10px] h-[50px] w-[200px] bg-blue-900 text-white place-content-center grid cursor-pointer"
      >
        Pobierz Leady
      </div>
    </div>
  );
}
