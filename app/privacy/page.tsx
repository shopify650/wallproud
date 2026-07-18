import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Logo />
        <Link href="/signup" className="btn-secondary text-sm">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display-xxl text-ink">Privacy Policy</h1>
        <p className="font-body-sm mt-2 text-muted">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 font-body text-muted leading-relaxed">
          <section>
            <h2 className="font-display-md mb-3 text-ink">1. Information We Collect</h2>
            <p>
              We collect information you provide when creating an account: name, email address, and profile information. We also collect testimonial data submitted through your collection pages and widgets.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">2. How We Use Your Information</h2>
            <p>
              We use your information to provide and improve the Service, process payments, send product updates, and respond to support requests. Testimonial data is displayed only as configured in your account.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">3. Data Storage and Security</h2>
            <p>
              Your data is stored securely on industry-standard cloud infrastructure. We implement encryption at rest and in transit, regular backups, and access controls to protect your information.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">4. Data Sharing</h2>
            <p>
              We do not sell your personal data. We may share data with third-party service providers who help us operate the Service (e.g., hosting, email delivery). These providers are bound by confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">5. Cookies</h2>
            <p>
              We use essential cookies for authentication and service functionality. We may use analytics cookies to understand usage patterns. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. Upon account deletion, we delete or anonymize your data within 30 days, except where required by law to retain it.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">7. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. You may export your data at any time from your account settings. Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">8. Third-Party Links</h2>
            <p>
              The Service may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of material changes via email or through the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">10. Contact</h2>
            <p>
              For privacy-related inquiries, contact us at{" "}
              <a href="mailto:support@wallproud.com" className="text-accent hover:underline">support@wallproud.com</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="mx-auto max-w-3xl px-6 py-10">
        <div className="border-t border-hairline-soft pt-8 text-center">
          <p className="font-caption text-muted">
            &copy; {new Date().getFullYear()} WallProud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
