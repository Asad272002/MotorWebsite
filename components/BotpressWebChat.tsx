"use client";

import Script from "next/script";

export function BotpressWebChat() {
  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.5/inject.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://files.bpcontent.cloud/2026/01/08/17/20260108173538-6DULEWDI.js"
        strategy="lazyOnload"
      />
    </>
  );
}
