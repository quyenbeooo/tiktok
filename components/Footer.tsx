import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted">
            <Link
              href="/privacy"
              className="transition-colors hover:text-neon-cyan"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-neon-cyan"
            >
              Terms of Service
            </Link>
          </div>

          <p className="max-w-2xl text-xs leading-relaxed text-muted/80">
            <strong className="text-muted">Disclaimer:</strong> This tool is for
            educational and personal use only. We are not affiliated with TikTok
            or ByteDance. Users are fully responsible for any copyright
            infringements.
          </p>

          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} SnapTik-Pro Clone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
