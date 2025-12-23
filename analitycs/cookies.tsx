"use client";

import React from "react";
import Script from "next/script";

export default function Cookies() {
  return (
    <Script
      id="cookieyes"
      src="https://cdn-cookieyes.com/client_data/2e3a14035f8a1b4efce3a26bdd1288d1/script.js"
      strategy="afterInteractive"
    />
  );
}
