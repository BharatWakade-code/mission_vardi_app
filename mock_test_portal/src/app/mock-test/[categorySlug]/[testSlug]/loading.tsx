import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
      
      {/* Premium Logo Pulse */}
      <div style={{ position: "relative", width: "72px", height: "72px", marginBottom: "24px" }} className="animate-pulse">
        <div style={{ 
          width: "100%", 
          height: "100%", 
          borderRadius: "16px", 
          overflow: "hidden", 
          border: "1px solid rgba(0,0,0,0.06)", 
          background: "rgba(0,0,0,0.02)", 
          boxShadow: "0 0 30px rgba(37, 99, 235, 0.1)"
        }}>
          <img src="/logo.png" alt="MH Mock Test Loading" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      
      {/* Professional Typography */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#1e293b", marginBottom: "6px", letterSpacing: "0.5px" }}>
        प्रश्नपत्रिका लोड होत आहे...
      </h2>
      
      {/* Subtle Brand Tagline */}
      <p style={{ color: "#475569", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
        MH Mock Test Portal
      </p>
      
    </div>
  );
}
