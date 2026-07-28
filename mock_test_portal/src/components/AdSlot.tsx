"use client";

import React from "react";

interface AdSlotProps {
  type?: "leaderboard" | "sidebar" | "infeed";
  slotId?: string;
  title?: string;
}

export default function AdSlot({ 
  type = "leaderboard", 
  slotId = "default-slot",
  title = "Sponsored Google AdSense Display" 
}: AdSlotProps) {
  
  // Temporarily hiding all ads until a domain is ready and AdSense is officially approved.
  return null;
}
