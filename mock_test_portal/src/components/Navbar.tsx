"use client";

import React, { useEffect, useState } from "react";
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
  Award,
  UserCircle
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("tabchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("tabchange", handleHashChange);
    };
  }, []);

  // Hide Navbar when on a specific mock test page
  const isTestPage = pathname.startsWith("/mock-test/") && pathname.split("/").length >= 4;
  if (isTestPage) return null;

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={12} /> },
    { 
      name: "Mock Tests", 
      href: "/mock-tests-menu", 
      icon: <Award size={12} />,
      subLinks: [
        { name: "All Mock Tests", href: "/#mock-tests" },
        { name: "Police Exams", href: "/mock-test/police-bharti" },
        { name: "Revenue Dept", href: "/mock-test/talathi-bharti" },
        { name: "District Council", href: "/mock-test/zilla-parishad" },
        { name: "Forest Dept", href: "/mock-test/forest-guard" }
      ]
    },
    { 
      name: "Resources", 
      href: "/resources-menu", 
      icon: <FileText size={12} />,
      subLinks: [
        { name: "Study Notes", href: "/#study-notes" },
        { name: "PYQ Papers", href: "/#pyqs" }
      ]
    },
    { name: "Leaderboard", href: "/#leaderboard", icon: <Award size={12} /> },
    { name: "Fitness", href: "/#physical-test", icon: <Zap size={12} /> },
    { name: "Profile", href: "/#profile", icon: <UserCircle size={12} /> },
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
            <img src="/logo.png" alt="EduSaaS Web Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px", lineHeight: "1.1" }}>
              Edu<span style={{ color: "#f97316" }}>SaaS</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
              Premium Platform
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
            let isActive = false;
            
            if (link.href === "/") {
              isActive = pathname === "/" && (!currentHash || currentHash === "#");
            } else if (link.href.startsWith("/#")) {
              isActive = pathname === "/" && currentHash === link.href.substring(1);
            } else if (pathname.startsWith(link.href)) {
              isActive = true;
            }
            
            if (link.subLinks && link.subLinks.some(sub => sub.href.startsWith("/mock-test/") && pathname.startsWith(sub.href))) {
              isActive = true;
            }

            if (link.subLinks) {
              return (
                <div key={link.name} className="dropdown-container" style={{ position: "relative" }}>
                  <div
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
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    className="nav-link-hover"
                  >
                    <span style={{ color: isActive ? "#fb923c" : "#94a3b8" }}>{link.icon}</span>
                    {link.name} ▾
                  </div>
                  <div className="dropdown-menu" style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "rgba(15, 23, 42, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "8px",
                    minWidth: "200px",
                    display: "none",
                    flexDirection: "column",
                    gap: "4px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                  }}>
                    {link.subLinks.map(sub => {
                      const isSubActive = sub.href.startsWith("/mock-test/") && pathname.startsWith(sub.href);
                      return (
                        <Link 
                          key={sub.name} 
                          href={sub.href} 
                          onClick={(e) => {
                            if (sub.href.startsWith('/#')) {
                              e.preventDefault();
                              window.location.hash = sub.href.replace('/', '');
                              window.dispatchEvent(new Event('hashchange'));
                            }
                          }}
                          style={{ padding: "8px 12px", color: isSubActive ? "#fff" : "#cbd5e1", background: isSubActive ? "rgba(249, 115, 22, 0.15)" : "transparent", textDecoration: "none", fontSize: "0.9rem", borderRadius: "8px", transition: "all 0.2s" }} 
                          className="dropdown-item"
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/#')) {
                    e.preventDefault();
                    window.location.hash = link.href.replace('/', '');
                    window.dispatchEvent(new Event('hashchange'));
                  }
                }}
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
              let isActive = false;
            
              if (link.href === "/") {
                isActive = pathname === "/" && (!currentHash || currentHash === "#");
              } else if (link.href.startsWith("/#")) {
                isActive = pathname === "/" && currentHash === link.href.substring(1);
              } else if (pathname.startsWith(link.href)) {
                isActive = true;
              }
              
              if (link.subLinks && link.subLinks.some(sub => sub.href.startsWith("/mock-test/") && pathname.startsWith(sub.href))) {
                isActive = true;
              }

              if (link.subLinks) {
                return (
                  <div key={link.name} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 18px",
                      borderRadius: "12px",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: isActive ? "#ffffff" : "#cbd5e1",
                      background: isActive ? "rgba(249, 115, 22, 0.15)" : "rgba(255, 255, 255, 0.03)",
                      border: isActive ? "1px solid rgba(249, 115, 22, 0.3)" : "1px solid transparent"
                    }}>
                      <span style={{ color: isActive ? "#fb923c" : "#94a3b8" }}>{link.icon}</span>
                      {link.name}
                    </div>
                    <div style={{ paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {link.subLinks.map(sub => {
                        const isSubActive = sub.href.startsWith("/mock-test/") && pathname.startsWith(sub.href);
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={(e) => {
                              if (sub.href.startsWith('/#')) {
                                e.preventDefault();
                                window.location.hash = sub.href.replace('/', '');
                                window.dispatchEvent(new Event('hashchange'));
                              }
                              setMobileMenuOpen(false);
                            }}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              color: isSubActive ? "#ffffff" : "#cbd5e1",
                              textDecoration: "none",
                              background: isSubActive ? "rgba(249, 115, 22, 0.15)" : "rgba(255, 255, 255, 0.02)"
                            }}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('/#')) {
                      e.preventDefault();
                      window.location.hash = link.href.replace('/', '');
                      window.dispatchEvent(new Event('hashchange'));
                    }
                    setMobileMenuOpen(false);
                  }}
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
        .dropdown-container:hover .dropdown-menu {
          display: flex !important;
        }
        .dropdown-item:hover {
          background: rgba(249, 115, 22, 0.15) !important;
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
