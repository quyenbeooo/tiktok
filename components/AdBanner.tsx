"use client";

import Script from "next/script";

/** Banner ad — placed below the main download input. */
export default function AdBanner() {
  return (
    <div className="mx-auto mt-6 flex w-full max-w-2xl justify-center overflow-hidden">
      <Script
        src="https://pl30220165.effectivecpmnetwork.com/e8ae472dbe081479377afef3a2340a0a/invoke.js"
        strategy="lazyOnload"
        async
        data-cfasync="false"
      />
      <div
        id="container-e8ae472dbe081479377afef3a2340a0a"
        className="min-h-[90px] w-full"
      />
    </div>
  );
}
