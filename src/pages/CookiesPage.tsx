export default function CookiesPage() {
  return (
    <div className="p-4 max-w-4xl mx-auto prose prose-sm">
      <h1>Cookie Policy</h1>
      <p className="text-gray-600">Last updated: July 2026</p>

      <hr className="my-4" />

      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device by your web browser. They help websites
        remember your preferences and improve functionality.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>SAFESTACK uses cookies for the following purposes:</p>
      <table className="w-full text-sm border mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Cookie Type</th>
            <th className="border p-2 text-left">Purpose</th>
            <th className="border p-2 text-left">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Session</td>
            <td className="border p-2">Maintain login session</td>
            <td className="border p-2">Session</td>
          </tr>
          <tr>
            <td className="border p-2">Authentication</td>
            <td className="border p-2">Remember authentication token</td>
            <td className="border p-2">7 days</td>
          </tr>
          <tr>
            <td className="border p-2">Preferences</td>
            <td className="border p-2">Save user preferences and theme</td>
            <td className="border p-2">1 year</td>
          </tr>
          <tr>
            <td className="border p-2">Analytics</td>
            <td className="border p-2">Track platform usage</td>
            <td className="border p-2">1 year</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mt-4">3. Third-Party Cookies</h2>
      <p>
        We may use third-party services (analytics, error tracking) that set their own cookies.
        These are governed by the respective third-party privacy policies.
      </p>

      <h2>4. Managing Cookies</h2>
      <p>
        You can control cookies through your browser settings. Disabling certain cookies may
        affect platform functionality. Most browsers allow you to:
      </p>
      <ul>
        <li>View and delete stored cookies</li>
        <li>Block third-party cookies</li>
        <li>Block all cookies (may break functionality)</li>
      </ul>

      <h2>5. Changes</h2>
      <p>
        We may update this Cookie Policy from time to time. Changes will be posted on this page.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about cookies: privacy@safestack.app
      </p>
    </div>
  );
}
