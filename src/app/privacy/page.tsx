import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-80 transition-opacity" style={{ color: "var(--text-muted)" }}>
          ← Back to Insspy
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
          Last updated: June 20, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>1. Information We Collect</h2>
            <p className="mb-2">When you use Insspy, we collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Information:</strong> Email address and encrypted password (via Supabase Auth).</li>
              <li><strong>Trade Data:</strong> Symbols, entry/exit prices, lot sizes, P&L, strategy tags, notes, screenshots, psychology ratings, and all other data you log.</li>
              <li><strong>Import Data:</strong> CSV files, MT5 export data, and API keys for auto-sync (stored securely).</li>
              <li><strong>Usage Data:</strong> Features used, page views, and AI analysis requests for improving the Service.</li>
              <li><strong>Device &amp; Browser Info:</strong> IP address, browser type, and operating system for analytics and security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and maintain the trading journal and analytics features</li>
              <li>To generate AI-powered insights based on your trade history</li>
              <li>To enforce usage limits and prevent abuse</li>
              <li>To communicate account-related notices and service updates</li>
              <li>To display advertisements via third-party ad networks</li>
              <li>To improve the Service through aggregate analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>3. Data Sharing</h2>
            <p className="mb-2">We do not sell your personal data. We share data only with trusted service providers who enable our operations:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase:</strong> Authentication and database hosting (CockroachDB via Supabase). Your password is never stored in plain text.</li>
              <li><strong>Adsterra:</strong> Ad delivery. Adsterra may use cookies or device identifiers subject to their own privacy policy.</li>
              <li><strong>AI Providers:</strong> Anonymized trade data may be sent to AI services for generating insights. No personally identifiable information is included.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>4. Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you delete your account, all associated data is permanently deleted within 30 days. CSV import logs and usage metrics may be retained in anonymized form for analytics.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>5. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access your data at any time through the dashboard</li>
              <li>Export your trades and reports</li>
              <li>Edit or delete individual trade entries</li>
              <li>Delete your entire account and all associated data</li>
              <li>Opt out of AI analysis features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>6. Cookies &amp; Tracking</h2>
            <p>We use essential cookies for authentication and session management. Third-party ad networks (Adsterra) may use cookies for ad personalization. You can control cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>7. Data Security</h2>
            <p>We implement industry-standard security measures including encryption in transit (TLS) and at rest. Authentication is handled by Supabase with bcrypt password hashing. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>8. Third-Party Links</h2>
            <p>The Service may contain links to third-party websites (e.g., broker sites, ad networks). We are not responsible for the privacy practices of these third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date. Material changes will be communicated via email or through the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>10. Contact</h2>
            <p>For privacy-related inquiries, contact us at <span style={{ color: "var(--primary)" }}>support@insspy.io</span>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
