import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Terms and Conditions</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <p className="mb-6">
        Welcome to Firm Frontier Bank ("we", "our", "us"). By creating an account, using our mobile or web app, or accessing any of our banking services, you agree to be bound by these Terms and Conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Eligibility</h2>
      <p className="mb-4">
        You must be at least 18 years old and capable of entering into a legally binding agreement to use our banking services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Account Security</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your account credentials, including passwords and PINs. Any transactions performed under your account will be considered authorized by you.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Services</h2>
      <p className="mb-4">
        Our platform provides financial services such as deposits, transfers, bill payments, and other digital banking operations. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Fees and Charges</h2>
      <p className="mb-4">
        Certain services may attract fees or transaction charges. You will be informed of these charges before completing any transaction.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Prohibited Activities</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Engaging in fraudulent or illegal activities.</li>
        <li>Using the app for money laundering or terrorist financing.</li>
        <li>Accessing or attempting to hack the platform’s infrastructure.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Limitation of Liability</h2>
      <p className="mb-4">
        Firm Frontier Bank shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services, unless caused by our proven negligence.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Suspension and Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or close your account at any time if we detect suspicious activity or a breach of these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms occasionally. Updates will be posted on this page, and continued use of our services means you accept the new Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact Us</h2>
      <p>
        For questions or complaints regarding these Terms, contact us at{" "}
        <a href="mailto:support@firmfrontierbank.com" className="text-blue-600 underline">
          support@firmfrontierbank.com
        </a>.
      </p>
    </div>
  );
}
