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
  const getContainerClass = () => {
    switch (type) {
      case "sidebar":
        return "ad-sidebar";
      case "infeed":
        return "ad-infeed";
      case "leaderboard":
      default:
        return "ad-leaderboard";
    }
  };

  return (
    <div className="ad-slot-wrapper animate-fade">
      <span className="ad-label">Advertisement • Support Free Mock Tests</span>
      <div className={`ad-slot ${getContainerClass()}`} data-ad-slot={slotId}>
        <div className="ad-content-placeholder">
          <span style={{ fontSize: "1.2rem" }}>✨</span>
          <div>
            <div style={{ color: "#cbd5e1", fontWeight: 600, fontSize: "0.9rem" }}>
              {title}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.75rem" }}>
              Google AdSense / AdMob Responsive Ad Placement ({type.toUpperCase()})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
