"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "🏠 मुख्य पृष्ठ (Home)", href: "/" },
    { name: "🛡️ पोलीस भरती", href: "/mock-test/police-bharti" },
    { name: "📜 तलाठी भरती", href: "/mock-test/talathi-bharti" },
    { name: "🏛️ MPSC राज्यसेवा", href: "/mock-test/mpsc-rajyaseva" },
    { name: "🏢 जिल्हा परिषद (ZP)", href: "/mock-test/zilla-parishad" },
  ];

  return (
    <header style={{
      background: "rgba(11, 17, 32, 0.9)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      width: "100%"
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "76px"
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "var(--primary-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            boxShadow: "0 0 20px rgba(249, 115, 22, 0.4)"
          }}>
            🛡️
          </div>
          <div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
              Mission<span className="gradient-text">Vardi</span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 500, letterSpacing: "0.5px" }}>
              MAJHI NAUKRI MOCK TEST PORTAL
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: isActive ? "#ffffff" : "#cbd5e1",
                  background: isActive ? "rgba(249, 115, 22, 0.15)" : "transparent",
                  border: isActive ? "1px solid rgba(249, 115, 22, 0.4)" : "1px solid transparent",
                  transition: "var(--transition)"
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button & Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="badge badge-orange animate-pulse" style={{ display: "none" }} id="free-badge">
            🔥 100% FREE 2026 TESTS
          </span>
          <Link href="#all-tests" className="btn btn-primary" style={{ padding: "10px 18px", fontSize: "0.9rem" }}>
            ⚡ सराव सुरू करा
          </Link>
          
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "none"
            }}
            className="mobile-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: "#0f172a",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: isActive ? "#ffffff" : "#cbd5e1",
                  background: isActive ? "rgba(249, 115, 22, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  textDecoration: "none"
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Inline style for responsive hiding */}
      <style jsx>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 600px) {
          #free-badge { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
