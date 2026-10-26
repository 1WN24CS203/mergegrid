import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 relative overflow-hidden items-center justify-center p-12">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Accent dots */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-brand-400/8 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="MergeGrid" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Merge<span className="text-brand-400">Grid</span>
          </h1>
          <p className="text-neutral-400 text-base leading-relaxed">
            Build together. Compete fairly.<br />
            Contribute openly. Grow together.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-neutral-500">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">500+</div>
              <div>Problems</div>
            </div>
            <div className="w-px h-8 bg-neutral-700" />
            <div className="text-center">
              <div className="text-lg font-semibold text-white">1K+</div>
              <div>Developers</div>
            </div>
            <div className="w-px h-8 bg-neutral-700" />
            <div className="text-center">
              <div className="text-lg font-semibold text-white">50+</div>
              <div>Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
