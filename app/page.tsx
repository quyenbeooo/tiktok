import HeroInput from "@/components/HeroInput";
import { Download, Shield, Zap, Smartphone } from "lucide-react";

const features = [
  {
    icon: Download,
    title: "No Watermark",
    description: "Download clean HD videos without the TikTok logo overlay.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process and download videos in seconds with our optimized servers.",
  },
  {
    icon: Shield,
    title: "100% Free",
    description: "No hidden fees, no registration, no limits on downloads.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Works perfectly on iPhone, Android, and all mobile browsers.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-neon-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-neon-cyan/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <HeroInput />

        {/* Features grid */}
        <section className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-surface/50 p-6 transition-all duration-300 hover:border-neon-red/30 hover:bg-surface"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-neon-red/10 text-neon-red transition-colors group-hover:bg-neon-red/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        {/* How to use */}
        <section className="mt-20 text-center">
          <h2 className="mb-8 text-2xl font-bold text-white">
            How to <span className="gradient-text">Download</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", text: "Copy the TikTok video link from the app or website" },
              { step: "2", text: "Paste the link into the input box above" },
              { step: "3", text: "Click Download and save your video, audio, or photos" },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-border bg-surface/30 p-6"
              >
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-neon-red to-neon-cyan text-sm font-bold text-white">
                  {item.step}
                </div>
                <p className="text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
