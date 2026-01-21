import {
  ArrowRight,
  FileText,
  Globe,
  Image as ImageIcon,
  Music,
  Play,
  Sparkles,
  Users,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';

function StarField() {
  // Generate deterministic star positions
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 100}%`,
    delay: `${(i * 0.7) % 5}s`,
    size: i % 3 === 0 ? 3 : 2,
  }));

  return (
    <div className="stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            width: star.size,
            height: star.size,
          }}
        />
      ))}
    </div>
  );
}

function PortalIcon() {
  return (
    <div className="relative float">
      {/* Outer glow rings */}
      <div className="absolute -inset-8 rounded-full bg-linear-to-r from-teal-500/20 via-violet-500/10 to-amber-500/20 blur-2xl pulse-glow" />
      <div className="absolute -inset-4 rounded-full bg-linear-to-br from-teal-400/30 to-violet-500/20 blur-xl" />

      {/* Main portal */}
      <div className="relative w-28 h-28 rounded-2xl glass glow-teal flex items-center justify-center">
        <div className="absolute inset-2 rounded-xl bg-linear-to-br from-teal-500/20 via-transparent to-amber-500/10" />
        <Sparkles className="w-12 h-12 text-teal-300 relative z-10" />
      </div>

      {/* Floating particles */}
      <div className="absolute -top-3 -right-3 w-3 h-3 rounded-full bg-amber-400/80 blur-[1px] float-delayed" />
      <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-teal-400/80 blur-[1px] float" />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  accentColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accentColor: 'teal' | 'amber' | 'rose';
}) {
  const accentClasses = {
    teal: 'from-teal-500/20 to-teal-500/5 group-hover:border-teal-500/40 text-teal-400',
    amber:
      'from-amber-500/20 to-amber-500/5 group-hover:border-amber-500/40 text-amber-400',
    rose: 'from-rose-500/20 to-rose-500/5 group-hover:border-rose-500/40 text-rose-400',
  };

  return (
    <div className="group glass card-lift rounded-2xl p-6 border border-white/5 hover:glow-soft">
      <div
        className={`w-12 h-12 rounded-xl bg-linear-to-br ${accentClasses[accentColor]} flex items-center justify-center mb-4 transition-all duration-300`}
      >
        <Icon
          className={`w-6 h-6 ${accentClasses[accentColor].split(' ').pop()}`}
        />
      </div>
      <h3 className="text-xl font-semibold text-amber-50/90 mb-2 font-display">
        {title}
      </h3>
      <p className="text-stone-400 leading-relaxed">{description}</p>
    </div>
  );
}

function MediaTypeIcon({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}) {
  return (
    <div className="group flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={`absolute inset-0 ${color} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
        />
        <div className="relative w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:border-white/10 transition-all duration-300">
          <Icon
            className={`w-7 h-7 ${color.replace('bg-', 'text-').replace('/50', '-400')}`}
          />
        </div>
      </div>
      <span className="text-stone-400 text-sm font-medium group-hover:text-stone-300 transition-colors">
        {label}
      </span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] relative overflow-hidden grain">
      <StarField />

      {/* Ambient light sources */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[80px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-24 pb-20 text-center">
        <div className="flex justify-center mb-10">
          <PortalIcon />
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 font-display tracking-tight">
          <span className="text-gradient-ethereal">Magic Box</span>
        </h1>

        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-stone-400 leading-relaxed font-light">
          A portal for shared experiences. Watch together,
          <span className="text-amber-300/80"> in perfect sync</span>.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/newchannel"
            className="btn-ethereal text-white flex items-center gap-3 text-lg group"
          >
            <span>Start here</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/channels"
            className="btn-ghost text-stone-300 flex items-center gap-3 text-lg"
          >
            <Globe className="w-5 h-5" />
            <span>Explore</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-warm mb-4 font-display">
            Gather &amp; Share
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto text-lg">
            Create spaces for connection and shared discovery
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={Users}
            title="Live Together"
            description="Share links instantly with everyone in your channel. See what others discover in real-time."
            accentColor="teal"
          />
          <FeatureCard
            icon={Play}
            title="Perfect Sync"
            description="YouTube videos play and pause together. Every moment experienced simultaneously."
            accentColor="amber"
          />
          <FeatureCard
            icon={Globe}
            title="Your Space"
            description="Public channels for open gatherings, or private portals shared only with those you choose."
            accentColor="rose"
          />
        </div>
      </section>

      {/* Supported Media Section */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-100 mb-4 font-display">
            Share <span className="text-gradient-cosmic">Anything</span>
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto text-lg">
            From videos to documents, every format finds its place
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
          <MediaTypeIcon icon={Youtube} label="YouTube" color="bg-red-500/50" />
          <MediaTypeIcon icon={Music} label="Spotify" color="bg-green-500/50" />
          <MediaTypeIcon
            icon={ImageIcon}
            label="Images"
            color="bg-amber-500/50"
          />
          <MediaTypeIcon
            icon={FileText}
            label="Documents"
            color="bg-cyan-500/50"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center glass-warm rounded-3xl p-12 md:p-16">
          <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-teal-500/5 via-transparent to-amber-500/5 pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold text-stone-100 mb-4 font-display relative">
            Ready to gather?
          </h2>
          <p className="text-stone-400 mb-8 text-lg relative">
            Create your first channel and invite friends to join the experience.
          </p>
          <Link
            href="/newchannel"
            className="btn-ethereal text-white inline-flex items-center gap-3 text-lg group relative"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create Channel</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 text-center border-t border-white/5">
        <p className="text-stone-600 text-sm">
          Magic Box — Open source media sharing.{' '}
          <a
            href="https://github.com/mrganser/magicbox"
            className="text-teal-500/70 hover:text-teal-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
