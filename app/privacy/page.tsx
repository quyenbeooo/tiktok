import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SnapTik-Pro Clone",
  description: "Privacy Policy for SnapTik-Pro Clone TikTok downloader.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-neon-cyan hover:underline"
      >
        ← Back to Home
      </Link>
      <h1 className="mb-6 text-3xl font-bold text-white">Privacy Policy</h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted">
        <p>
          SnapTik-Pro Clone (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy.
          This policy explains how we handle information when you use our
          TikTok downloader service.
        </p>
        <h2 className="text-lg font-semibold text-white">Information We Collect</h2>
        <p>
          We do not collect personal information. TikTok URLs you submit are
          processed in real-time and are not stored on our servers. We may
          collect anonymous usage analytics to improve our service.
        </p>
        <h2 className="text-lg font-semibold text-white">Third-Party Services</h2>
        <p>
          We use third-party APIs to fetch TikTok video data. These services may
          have their own privacy policies. We do not share your data with
          advertisers.
        </p>
        <h2 className="text-lg font-semibold text-white">Cookies</h2>
        <p>
          We may use essential cookies for basic functionality. No tracking cookies
          are used for advertising purposes.
        </p>
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <p>
          For privacy-related inquiries, please contact us through our GitHub
          repository.
        </p>
      </div>
    </div>
  );
}
