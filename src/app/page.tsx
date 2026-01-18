import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Box,
  Users,
  Youtube,
  Music,
  FileText,
  Image as ImageIcon,
  Share2,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 relative overflow-hidden">
      {/* Gradient orbs for visual interest */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <Box className="h-16 w-16 text-violet-400" />
            </div>
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white via-violet-200 to-pink-200 bg-clip-text text-transparent inline-block pb-2">
            Magic Box
          </span>
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-slate-400 leading-relaxed">
          Share and watch media together in real-time. Create a channel, invite
          your friends, and enjoy synchronized viewing experiences.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
          >
            <Link href="/newchannel" className="flex items-center gap-2">
              Create Channel
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Link href="/channels">Browse Channels</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Features
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-lg mx-auto">
          Everything you need to share and enjoy media with friends
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-violet-500/50 transition-colors group">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                  <Users className="h-5 w-5" />
                </div>
                Real-time Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Share links instantly with everyone in your channel. See what
                others share in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-pink-500/50 transition-colors group">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 transition-colors">
                  <Zap className="h-5 w-5" />
                </div>
                YouTube Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Watch YouTube videos together with synchronized play/pause
                across all viewers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-blue-500/50 transition-colors group">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <Share2 className="h-5 w-5" />
                </div>
                Public &amp; Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Create public channels for everyone or private channels shared
                only via link.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Supported Media Section */}
      <section className="relative container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Supported Media
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-lg mx-auto">
          Share all your favorite content types
        </p>
        <div className="flex flex-wrap justify-center gap-12">
          <div className="flex flex-col items-center gap-3 group">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 group-hover:border-red-500/50 transition-colors">
              <Youtube className="h-8 w-8 text-red-400" />
            </div>
            <span className="text-slate-300 font-medium">YouTube</span>
          </div>
          <div className="flex flex-col items-center gap-3 group">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 group-hover:border-green-500/50 transition-colors">
              <Music className="h-8 w-8 text-green-400" />
            </div>
            <span className="text-slate-300 font-medium">Spotify</span>
          </div>
          <div className="flex flex-col items-center gap-3 group">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 group-hover:border-amber-500/50 transition-colors">
              <ImageIcon className="h-8 w-8 text-amber-400" />
            </div>
            <span className="text-slate-300 font-medium">Images</span>
          </div>
          <div className="flex flex-col items-center gap-3 group">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 group-hover:border-cyan-500/50 transition-colors">
              <FileText className="h-8 w-8 text-cyan-400" />
            </div>
            <span className="text-slate-300 font-medium">PDF &amp; Docs</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative container mx-auto px-4 py-12 text-center border-t border-slate-800">
        <p className="text-slate-500 text-sm">
          Magic Box - Open source media sharing.{' '}
          <a
            href="https://github.com/mrganser/magicbox"
            className="text-violet-400 hover:text-violet-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
