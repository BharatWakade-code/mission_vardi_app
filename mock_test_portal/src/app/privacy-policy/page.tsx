import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | MH Mock Test",
  description: "Privacy Policy for MH Mock Test portal. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: "100px 20px 60px" }}>
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>Privacy Policy</h1>
      
      <div style={{ lineHeight: "1.8", color: "#475569" }}>
        <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>1. Information We Collect</h2>
        <p>
          We do not collect any personal information unless you explicitly provide it (e.g., when contacting us for support).
          As a mock test portal, you can access and solve tests without needing to create an account or provide identifiable data.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>2. Log Files and Analytics</h2>
        <p>
          Like many other websites, we use log files and analytics services to understand how visitors use our site. This information may include internet protocol (IP) addresses, browser type, internet service provider (ISP), date and time stamps, referring/exit pages, and the number of clicks. This data is not linked to any information that is personally identifiable.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>3. Cookies and Web Beacons</h2>
        <p>
          We use cookies to store information about visitors' preferences, to record user-specific information on which pages the site visitor accesses or visits, and to personalize or customize our web page content based upon visitors' browser type or other information that the visitor sends via their browser.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>4. Google AdSense (Advertising)</h2>
        <p>
          Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.
        </p>
        <p>
          Some of our advertising partners may use cookies and web beacons on our site. Our advertising partners include Google AdSense.
        </p>

        <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" }}>5. Contact Us</h2>
        <p>
          If you require any more information or have any questions about our privacy policy, please feel free to <Link href="/contact-us" style={{ color: "var(--primary)" }}>contact us</Link>.
        </p>
      </div>
    </div>
  );
}
