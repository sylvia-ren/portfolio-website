"use client";

import { useEffect } from "react";

/*
 * nested layouts cannot set attributes on <html>; this keeps body-level
 * tokens (--bg, --fg) aligned with the active room for overscroll and
 * the mobile browser chrome.
 */
export function RoomMarker({ room }: { room: "paper" | "dark" }) {
  useEffect(() => {
    document.documentElement.dataset.room = room;
    return () => {
      delete document.documentElement.dataset.room;
    };
  }, [room]);

  return null;
}
