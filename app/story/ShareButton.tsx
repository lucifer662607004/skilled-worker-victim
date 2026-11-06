"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.origin + window.location.pathname;
    const data = {
      title: "Keep the promise",
      text: "Skilled workers already on the path to settlement are being moved from 5 years to 10. Don't make it retrospective.",
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // dismissed or unsupported: fall back to copying
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="btn btn-ghost" onClick={share} aria-live="polite">
      {copied ? "Link copied" : "Share this page"}
    </button>
  );
}
