"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Trophy,
  Crown,
  BookOpen,
  Menu,
  X,
  Zap,
  User
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide Navbar when on a specific mock test page
  const isTestPage = pathname.startsWith("/mock-test/") && pathname.split("/").length >= 4;
  if (isTestPage) return null;

  const navLinks = [
    { name: "Mock Tests", href: "/mock-test", icon: <FileText size={14} /> },
    { name: "Test Series", href: "/pricing", icon: <Trophy size={14} /> },
    { name: "Subscription", href: "/pricing", icon: <Crown size={14} /> },
    { name: "Books", href: "/#packages", icon: <BookOpen size={14} /> },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)"
      }}
    >
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "80px",
        padding: "0 32px",
        maxWidth: "1280px",
        margin: "0 auto"
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
              background: "rgba(0,0,0,0.02)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(0,0,0,0.06)",
              overflow: "hidden"
            }}>
            <img src="/logo.png" alt="MH Mock Test Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: "1.1" }}>
              MH<span style={{ color: "#2563eb" }}>MockTest</span>
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
          border: "1px solid rgba(0, 0, 0, 0.02)"
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
                  color: isActive ? "#0f172a" : "#475569",
                  background: isActive ? "rgba(37, 99, 235, 0.1)" : "transparent",
                  boxShadow: isActive ? "inset 0 0 0 1px rgba(37, 99, 235, 0.15)" : "none",
                  transition: "all 0.3s ease"
                }}
                className="nav-link-hover"
              >
                <span style={{ color: isActive ? "#2563eb" : "#94a3b8" }}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button & Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="desktop-badge" style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "6px 12px", borderRadius: "100px", color: "#059669", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <span style={{ width: "8px", height: "8px", background: "#059669", borderRadius: "50%", boxShadow: "0 0 10px #059669" }} className="animate-pulse"></span>
            100% Free
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/pricing" style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              fontSize: "0.95rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#fff",
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.1), inset 0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <Zap size={18} fill="#fff" />
              Premium Tests
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/profile" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              background: "rgba(0, 0, 0, 0.03)",
              color: "#0f172a",
              borderRadius: "50%",
              textDecoration: "none",
              border: "1px solid rgba(0,0,0,0.08)"
            }} title="My Profile">
              <User size={20} />
            </Link>
          </motion.div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "rgba(0, 0, 0, 0.02)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              color: "#0f172a",
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
              background: "#ffffff",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
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
                    color: isActive ? "#0f172a" : "#475569",
                    background: isActive ? "rgba(37, 99, 235, 0.1)" : "rgba(255, 255, 255, 0.03)",
                    border: isActive ? "1px solid rgba(37, 99, 235, 0.1)" : "1px solid transparent",
                    textDecoration: "none"
                  }}
                >
                  <span style={{ color: isActive ? "#2563eb" : "#94a3b8" }}>{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .nav-link-hover:hover {
          background: rgba(37, 99, 235, 0.08) !important;
          color: #2563eb !important;
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
