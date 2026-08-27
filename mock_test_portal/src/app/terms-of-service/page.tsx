import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | MH Mock Test",
  description: "Terms of Service and Conditions for using the MH Mock Test portal.",
};

export default function TermsOfService() {
  return (
    <div className="container" style={{ padding: "100px 20px 60px" }}>
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>Terms of Service</h1>
      
      <div style={{ lineHeight: "1.8", color: "#475569" }}>
        <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>1. Acceptance of Terms</h2>
        <p>
          By accessing and using <strong>MH Mock Test</strong> (mhmocktest.in), you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>2. Description of Service</h2>
        <p>
          MH Mock Test is an independent educational portal that provides free practice tests and mock exams for students preparing for competitive exams in Maharashtra. The platform is offered "as is" without any guarantees regarding the absolute accuracy of the mock tests, though we strive to provide the best quality content possible.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>3. User Conduct</h2>
        <p>
          You agree to use our website only for lawful purposes. You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>4. Intellectual Property</h2>
        <p>
          The content, layout, design, data, and graphics on this website are protected by intellectual property laws. You may not reproduce, download, or copy any content for commercial use without our written permission.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>5. Disclaimer of Warranties</h2>
        <p>
          We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
        </p>
        <p>
          <strong>MH Mock Test is NOT affiliated with any government agency or official examination board.</strong>
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>6. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms of service at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>7. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please <Link href="/contact-us" style={{ color: "var(--primary)" }}>contact us</Link>.
        </p>
      </div>
    </div>
  );
}
