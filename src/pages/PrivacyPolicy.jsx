import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <p className="mb-6">
        This Privacy Policy explains how Firm Frontier Bank ("we", "our", "us") collects, uses, and protects your personal data when you use our digital banking services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal information such as name, email, phone number, and address.</li>
        <li>Financial information like account numbers and transaction history.</li>
        <li>Device and usage data, including IP address and browser type.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To process transactions and provide banking services.</li>
        <li>To verify your identity and prevent fraud.</li>
        <li>To improve our products and customer experience.</li>
        <li>To comply with legal and regulatory requirements.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
      <p className="mb-4">
        We use advanced encryption, access control, and security monitoring to protect your data from unauthorized access or misuse.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Sharing of Information</h2>
      <p className="mb-4">
        We do not sell your personal data. We may share it only with authorized service providers or regulators when required by law.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cookies</h2>
      <p className="mb-4">
        Our website and app may use cookies to enhance your experience. You can manage cookie preferences in your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at{" "}
        <a href="mailto:info@firmfrontierbank.com" className="text-blue-600 underline">
          info@firmfrontierbank.com
        </a>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Updates to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. Any updates will be reflected on this page with a new “Last updated” date.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Us</h2>
      <p>
        For inquiries about our privacy practices, email us at{" "}
        <a href="mailto:info@firmfrontierbank.com" className="text-blue-600 underline">
          info@firmfrontierbank.com
        </a>.
      </p>
    </div>
  );
}
