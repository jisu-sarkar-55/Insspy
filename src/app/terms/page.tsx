import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-80 transition-opacity" style={{ color: "var(--text-muted)" }}>
          ← Back to Insspy
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          Terms & Conditions
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
          Last updated: June 20, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>1. Acceptance of Terms</h2>
            <p>By signing up for and using Insspy (&ldquo;the Service&rdquo;), you agree to be bound by these Terms & Conditions. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>2. Description of Service</h2>
            <p>Insspy is a trading journal and analytics platform that allows users to log trades, track performance, receive AI-powered insights, generate reports, and participate in gamified challenges. The Service is provided for educational and informational purposes only. It does not constitute financial advice.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>3. Account Registration</h2>
            <p>You must provide a valid email address and create a password to register. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must be at least 18 years old to use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to access another user&apos;s account or data</li>
              <li>Submit false or misleading trade data</li>
              <li>Interfere with the operation of the Service</li>
              <li>Use automated tools to scrape or abuse the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>5. Usage Limits</h2>
            <p>The Service operates on a usage-based free tier. Limits apply to trades, AI analyses, CSV imports, active goals, setup playbooks, and PDF report downloads. These limits are subject to change at our discretion. We will make reasonable efforts to notify you of material changes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>6. Data Ownership</h2>
            <p>You retain full ownership of all trade data, notes, and content you enter into the Service. We do not claim any intellectual property rights over your data. You may export or delete your data at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>7. AI Analysis</h2>
            <p>The Service provides AI-generated insights based on your trade data. These insights are algorithmic outputs and should not be relied upon as financial advice. We make no guarantees regarding the accuracy, completeness, or usefulness of AI-generated content.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>8. Third-Party Services</h2>
            <p>The Service integrates with third-party services including Supabase (authentication and database) and Adsterra (advertising). Your use of these services is subject to their respective terms. We are not responsible for the practices of third-party providers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>9. Limitation of Liability</h2>
            <p>Insspy is provided &ldquo;as is&rdquo; without any warranty. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. This includes but is not limited to trading losses, data loss, or service interruptions.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>10. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violations of these terms. You may delete your account at any time by contacting us. Upon termination, your data will be deleted within 30 days unless required otherwise by law.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>11. Changes to Terms</h2>
            <p>We may update these terms at any time. Material changes will be communicated via email or through the Service. Continued use after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>12. Contact</h2>
            <p>For questions about these terms, contact us at <span style={{ color: "var(--primary)" }}>support@insspy.io</span>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
