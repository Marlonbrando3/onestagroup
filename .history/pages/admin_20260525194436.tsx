import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import AsariCrm from "../components/asariCrm";
import FacebookVeryfication from "@/components/facebookVeryfication";
import FacebookGetLeads from "@/components/facebookGetLeads";
import FacebookGetForms from "@/components/facebookGetForms";

export default function Panel() {
  const [permission, setPermission] = useState(true);
  const [dataToShow, setDataToShow] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return <div>Sprawdzanie...</div>;

  return (
    permission && (
      <div className="p-[40px]">
        <div className="flex">
          <AsariCrm />
          <FacebookVeryfication />
          <FacebookGetLeads />
          <FacebookGetForms
            dataToShow={dataToShow}
            setDataToShow={setDataToShow}
          />{" "}
        </div>
        {dataToShow}
      </div>
    )
  );
}
