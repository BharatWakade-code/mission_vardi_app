import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About Us | MH Mock Test",
  description: "Learn more about MH Mock Test, Maharashtra's top free mock test portal for competitive exams.",
};

export default function AboutUs() {
  return (
    <div className="container" style={{ padding: "100px 20px 60px" }}>
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>About Us</h1>
      
      <div style={{ lineHeight: "1.8", color: "#e2e8f0" }}>
        <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          Welcome to <strong>MH Mock Test</strong>, your number one source for competitive exam preparation in Maharashtra.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>Our Mission</h2>
        <p>
          Our mission is to provide high-quality, completely free educational resources and practice tests to students across Maharashtra. 
          We understand the financial constraints many aspirants face while preparing for exams like Police Bharti, Talathi Bharti, MPSC, and Zilla Parishad. 
          Therefore, we aim to bridge the gap by offering premium-quality mock tests without any cost.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>What We Offer</h2>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginBottom: "20px" }}>
          <li><strong>Police Bharti Mock Tests:</strong> Comprehensive practice papers based on the latest syllabus.</li>
          <li><strong>Talathi Bharti (TCS Pattern):</strong> Up-to-date tests matching the current examination patterns.</li>
          <li><strong>MPSC Rajyaseva:</strong> Quality questions for state service preparation.</li>
          <li><strong>Zilla Parishad (ZP) Exams:</strong> Targeted practice sets for various ZP recruitment exams.</li>
        </ul>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>Why Choose Us?</h2>
        <p>
          Unlike many other portals that charge hefty fees, our platform is 100% free. We focus on providing an excellent user experience, detailed score reports, and immediate answer feedback so you can evaluate your performance instantly. Our site is designed to be accessible, fast, and completely focused on student success.
        </p>
        
        <div style={{ marginTop: "40px", padding: "20px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ marginBottom: "10px", color: "#ffffff" }}>Disclaimer</h3>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", margin: 0 }}>
            MH Mock Test is an independent educational portal. We are not officially affiliated with the Government of Maharashtra, MPSC, or any other government recruitment agency.
          </p>
        </div>

        <p style={{ marginTop: "30px" }}>
          We hope you enjoy using our mock tests as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to <Link href="/contact-us" style={{ color: "var(--primary)" }}>contact us</Link>.
        </p>
      </div>
    </div>
  );
}
