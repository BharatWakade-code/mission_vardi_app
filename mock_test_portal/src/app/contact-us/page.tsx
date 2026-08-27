"use client";

import React, { useState } from "react";

export default function ContactUs() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: "100px 20px 60px" }}>
      <h1 style={{ marginBottom: "20px", fontSize: "2.5rem" }}>Contact Us</h1>
      <p style={{ marginBottom: "40px", color: "#94a3b8", fontSize: "1.1rem", maxWidth: "600px" }}>
        Have questions, feedback, or need help with a mock test? We'd love to hear from you. 
        Fill out the form below or reach out to us directly via email.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
        
        {/* Contact Form */}
        <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.02)" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>✅</div>
              <h3 style={{ color: "#4ade80", marginBottom: "10px" }}>Message Sent Successfully!</h3>
              <p style={{ color: "#94a3b8" }}>We will get back to you as soon as possible.</p>
              <button 
                onClick={() => setStatus("idle")}
                style={{ marginTop: "20px", padding: "10px 20px", background: "var(--primary)", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569" }}>Full Name</label>
                <input 
                  type="text" 
                  required
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(0,0,0,0.06)", color: "#fff" }} 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569" }}>Email Address</label>
                <input 
                  type="email" 
                  required
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(0,0,0,0.06)", color: "#fff" }} 
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569" }}>Subject</label>
                <input 
                  type="text" 
                  required
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(0,0,0,0.06)", color: "#fff" }} 
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569" }}>Message</label>
                <textarea 
                  required
                  rows={5}
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(0,0,0,0.06)", color: "#fff", resize: "vertical" }} 
                  placeholder="Write your message here..."
                />
              </div>
              <button 
                type="submit" 
                disabled={status === "submitting"}
                style={{ 
                  padding: "14px", 
                  background: "var(--primary-gradient)", 
                  border: "none", 
                  borderRadius: "6px", 
                  color: "#fff", 
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: status === "submitting" ? "not-allowed" : "pointer",
                  opacity: status === "submitting" ? 0.7 : 1
                }}
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#475569" }}>Get in Touch</h2>
          <p style={{ color: "#94a3b8", lineHeight: "1.7", marginBottom: "30px" }}>
            Whether you have a question about our mock tests, found a bug, or just want to say hi, we're ready to answer all your questions.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
              <div style={{ fontSize: "1.5rem" }}>📧</div>
              <div>
                <h4 style={{ color: "#475569", marginBottom: "4px" }}>Email Support</h4>
                <p style={{ color: "#94a3b8", margin: 0 }}>bharatwakade012@gmail.com</p>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
              <div style={{ fontSize: "1.5rem" }}>🕒</div>
              <div>
                <h4 style={{ color: "#475569", marginBottom: "4px" }}>Response Time</h4>
                <p style={{ color: "#94a3b8", margin: 0 }}>We typically reply within 24-48 hours during business days.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
