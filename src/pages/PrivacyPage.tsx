export default function PrivacyPage() {
  return (
    <div className="p-4 max-w-4xl mx-auto prose prose-sm">
      <h1>Privacy Policy</h1>
      <p className="text-gray-600">Last updated: July 2026</p>

      <hr className="my-4" />

      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly:</p>
      <ul>
        <li>Account registration data (name, email, organisation)</li>
        <li>User-generated content (inspection reports, incident records, worker profiles)</li>
        <li>Uploaded documents and files</li>
      </ul>
      <p>We also automatically collect:</p>
      <ul>
        <li>Usage data (pages visited, features used)</li>
        <li>Device and browser information</li>
        <li>IP address and approximate location</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain the Platform</li>
        <li>To improve and personalise user experience</li>
        <li>To generate compliance reports</li>
        <li>To communicate important updates</li>
        <li>To detect and prevent abuse</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <p>
        We do not sell your personal data. We may share data with:
      </p>
      <ul>
        <li>Service providers who help operate the Platform (hosting, analytics)</li>
        <li>Regulatory bodies if required by law</li>
        <li>Your organisation's administrators within your account scope</li>
      </ul>

      <h2>4. Data Retention</h2>
      <p>
        We retain your data for as long as your account is active, plus 90 days after account
        closure, unless a longer retention period is required by law.
      </p>

      <h2>5. Security</h2>
      <p>
        We implement industry-standard security measures including encryption at rest and in transit,
        access controls, and regular security audits.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have the right to access, correct, delete, or
        export your data. Contact privacy@safestack.app to exercise these rights.
      </p>

      <h2>7. Contact</h2>
      <p>
        Privacy-related inquiries: privacy@safestack.app
      </p>
    </div>
  );
}
