"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EXAM_CATEGORIES } from "@/data/mockTests";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer when on a specific mock test page
  const isTestPage = pathname.startsWith("/mock-test/") && pathname.split("/").length >= 4;
  if (isTestPage) return null;

  return (
    <footer style={{
      background: "#070c17",
      borderTop: "1px solid rgba(0, 0, 0, 0.06)",
      padding: "60px 0 30px 0",
      marginTop: "80px",
      color: "#94a3b8"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "40px",
          marginBottom: "50px"
        }}>
          {/* Col 1: About */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "var(--primary-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                color: "#fff"
              }}>
                🛡️
              </div>
              <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a" }}>
                MH<span className="gradient-text">MockTest</span>
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "16px" }}>
              महाराष्ट्रातील पोलीस भरती, तलाठी भरती, MPSC राज्यसेवा व जिल्हा परिषद परीक्षांची तयारी करणाऱ्या विद्यार्थ्यांसाठी <strong>मराठीतील नंबर १ मोफत मॉक टेस्ट पोर्टल</strong> (Majhi Naukri Mock Test Alternative).
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <span className="badge badge-orange">TCS / IBPS Pattern</span>
              <span className="badge badge-green">100% Free</span>
            </div>
          </div>

          {/* Col 2: Exam Categories */}
          <div>
            <h4 style={{ color: "#0f172a", marginBottom: "18px", fontSize: "1.1rem" }}>
              📋 मुख्य परीक्षा (Exam Categories)
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", padding: 0 }}>
              {EXAM_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/mock-test/${cat.slug}`} style={{ color: "#475569", transition: "var(--transition)", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links & SEO */}
          <div>
            <h4 style={{ color: "#0f172a", marginBottom: "18px", fontSize: "1.1rem" }}>
              ⚡ महत्वाच्या लिंक्स (Important Links)
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", padding: 0 }}>
              <li>
                <Link href="/" style={{ color: "#475569" }}>🏠 सर्व मोफत सराव प्रश्नपत्रिका (All Free Tests)</Link>
              </li>
              <li>
                <Link href="/mock-test/police-bharti" style={{ color: "#475569" }}>🛡️ पोलीस भरती अभ्यासक्रम व टेस्ट सिरीज २०२६</Link>
              </li>
              <li>
                <Link href="/mock-test/talathi-bharti" style={{ color: "#475569" }}>📜 तलाठी भरती TCS पॅटर्न ऑनलाइन टेस्ट</Link>
              </li>
              <li>
                <Link href="/#faq-section" style={{ color: "#475569" }}>❓ वारंवार विचारले जाणारे प्रश्न (FAQ)</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Disclaimer & Support */}
          <div>
            <h4 style={{ color: "#0f172a", marginBottom: "18px", fontSize: "1.1rem" }}>
              ⚠️ कायदेशीर सूचना (Disclaimer)
            </h4>
            <p style={{ fontSize: "0.85rem", lineHeight: "1.5", color: "#94a3b8", marginBottom: "12px" }}>
              हे एक स्वतंत्र शैक्षणिक पोर्टल असून याचा कोणत्याही सरकारी संस्थेशी किंवा आयोगाशी अधिकृत संबंध नाही. आम्ही विद्यार्थ्यांना स्पर्धा परीक्षेच्या सरावासाठी मोफत प्रश्नपत्रिका व मार्गदर्शन उपलब्ध करून देतो.
            </p>
            <div style={{ fontSize: "0.85rem", color: "#475569" }}>
              📧 सपोर्ट संपर्क: <strong>bharatwakade012@gmail.com</strong>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid rgba(0, 0, 0, 0.02)",
          paddingTop: "24px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          fontSize: "0.85rem",
          color: "#94a3b8"
        }}>
          <div>
            © {new Date().getFullYear()} <strong>MH Mock Test Portal</strong>. All rights reserved. Designed for Maharashtra Police & Civil Services Aspirants.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <Link href="/about-us" style={{ color: "inherit", textDecoration: "none" }}>About Us</Link>
            <Link href="/contact-us" style={{ color: "inherit", textDecoration: "none" }}>Contact Us</Link>
            <Link href="/privacy-policy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/terms-of-service" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
