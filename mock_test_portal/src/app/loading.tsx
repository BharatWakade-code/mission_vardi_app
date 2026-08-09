import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      
      {/* Premium Logo Pulse */}
      <div style={{ position: "relative", width: "72px", height: "72px", marginBottom: "24px" }} className="animate-pulse">
        <div style={{ 
          width: "100%", 
          height: "100%", 
          borderRadius: "16px", 
          overflow: "hidden", 
          border: "1px solid rgba(255,255,255,0.1)", 
          background: "rgba(255,255,255,0.05)", 
          boxShadow: "0 0 30px rgba(249, 115, 22, 0.2)"
        }}>
          <img src="/logo.png" alt="EduSaaS Web Loading" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      
      {/* Professional Typography */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#f8fafc", marginBottom: "6px", letterSpacing: "0.5px" }}>
        माहिती Loading...
      </h2>
      
      {/* Subtle Brand Tagline */}
      <p style={{ color: "#475569", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
        EduSaaS Web Portal
      </p>
      
    </div>
  );
}
