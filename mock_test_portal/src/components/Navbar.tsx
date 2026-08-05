"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ShieldCheck,
  FileText,
  Landmark,
  Building2,
  Menu,
  X,
  Zap,
  Award
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide Navbar when on a specific mock test page
  const isTestPage = pathname.startsWith("/mock-test/") && pathname.split("/").length >= 4;
  if (isTestPage) return null;

  const navLinks = [
    { name: "मुख्य पृष्ठ", href: "/", icon: <Home size={12} /> },
    { name: "पोलीस भरती", href: "/mock-test/police-bharti", icon: <ShieldCheck size={12} /> },
    { name: "तलाठी भरती", href: "/mock-test/talathi-bharti", icon: <FileText size={12} /> },
    { name: "MPSC राज्यसेवा", href: "/mock-test/mpsc-rajyaseva", icon: <Landmark size={12} /> },
    { name: "ZP भरती", href: "/mock-test/zilla-parishad", icon: <Building2 size={12} /> },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        background: "rgba(11, 17, 32, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)"
      }}
    >
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "80px"
      }}>
        {/* Brand Logo - Ultra Premium */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden"
            }}>
            <img src="/logo.png" alt="Bharti Mock Test Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px", lineHeight: "1.1" }}>
              Bharti<span style={{ color: "#f97316" }}>MockTest</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
              Premium Mock Portal
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(255, 255, 255, 0.03)",
          padding: "6px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.05)"
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 10px",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: isActive ? "#ffffff" : "#cbd5e1",
                  background: isActive ? "rgba(249, 115, 22, 0.15)" : "transparent",
                  boxShadow: isActive ? "inset 0 0 0 1px rgba(249, 115, 22, 0.4)" : "none",
                  transition: "all 0.3s ease"
                }}
                className="nav-link-hover"
              >
                <span style={{ color: isActive ? "#fb923c" : "#94a3b8" }}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button & Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="desktop-badge" style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "6px 12px", borderRadius: "100px", color: "#34d399", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", boxShadow: "0 0 10px #10b981" }} className="animate-pulse"></span>
            100% Free
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="#all-tests" style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              fontSize: "0.95rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#fff",
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.5), inset 0 2px 4px rgba(255,255,255,0.2)"
            }}>
              <Zap size={18} fill="#fff" />
              सराव सुरू करा
            </Link>
          </motion.div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              padding: "10px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              transition: "var(--transition)"
            }}
            className="mobile-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(15, 23, 42, 0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflow: "hidden"
            }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: isActive ? "#ffffff" : "#cbd5e1",
                    background: isActive ? "rgba(249, 115, 22, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    border: isActive ? "1px solid rgba(249, 115, 22, 0.3)" : "1px solid transparent",
                    textDecoration: "none"
                  }}
                >
                  <span style={{ color: isActive ? "#fb923c" : "#94a3b8" }}>{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .nav-link-hover:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #fff !important;
        }
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (max-width: 600px) {
          .desktop-badge { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
}
