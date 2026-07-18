import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Logo />
        <Link href="/signup" className="btn-secondary text-sm">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display-xxl text-ink">Terms of Service</h1>
        <p className="font-body-sm mt-2 text-muted">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 font-body text-muted leading-relaxed">
          <section>
            <h2 className="font-display-md mb-3 text-ink">1. Acceptance of Terms</h2>
            <p>
              By accessing or using WallProud ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">2. Description of Service</h2>
            <p>
              WallProud provides a platform for collecting, managing, and displaying testimonials and social proof content on websites. The Service includes embeddable widgets, collection pages, and related features.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">4. Acceptable Use</h2>
            <p>
              You agree not to use the Service for any unlawful purpose or in violation of any applicable laws. You may not submit false or misleading testimonials, spam, or content that infringes on third-party rights.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">5. Content Ownership</h2>
            <p>
              You retain all rights to the testimonials and content you collect using the Service. WallProud claims no intellectual property rights over your content. However, you grant us a limited license to display your content as part of providing the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">6. Service Availability</h2>
            <p>
              We strive for high availability but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue the Service at any time with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">7. Limitation of Liability</h2>
            <p>
              WallProud shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you have paid us in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">8. Changes to Terms</h2>
            <p>
              We may update these terms at any time. We will notify you of material changes via email or through the Service. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-display-md mb-3 text-ink">9. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
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
