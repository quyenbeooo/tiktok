import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SnapTik-Pro Clone",
  description: "Terms of Service for SnapTik-Pro Clone TikTok downloader.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-neon-cyan hover:underline"
      >
        ← Back to Home
      </Link>
      <h1 className="mb-6 text-3xl font-bold text-white">Terms of Service</h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted">
        <p>
          By using SnapTik-Pro Clone, you agree to the following terms and
          conditions.
        </p>
        <h2 className="text-lg font-semibold text-white">Acceptable Use</h2>
        <p>
          This tool is provided for personal and educational use only. You must
          not use downloaded content for commercial purposes without proper
          authorization from the content creator.
        </p>
        <h2 className="text-lg font-semibold text-white">Copyright</h2>
        <p>
          All TikTok content belongs to its respective creators and TikTok/ByteDance.
          Users are solely responsible for ensuring they have the right to
          download and use any content obtained through this service.
        </p>
        <h2 className="text-lg font-semibold text-white">Disclaimer</h2>
        <p>
          This service is provided &quot;as is&quot; without warranties of any kind. We
          are not affiliated with TikTok or ByteDance. We are not responsible for
          any misuse of downloaded content.
        </p>
        <h2 className="text-lg font-semibold text-white">Limitation of Liability</h2>
        <p>
          We shall not be liable for any damages arising from the use of this
          service, including but not limited to copyright infringement claims.
        </p>
      </div>
    </div>
  );
}
