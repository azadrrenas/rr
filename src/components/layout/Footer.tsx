import Link from "next/link";
import { Instagram, Music2, Image as ImageIcon, Github, Mail } from "lucide-react";

const SOCIALS = [
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://open.spotify.com", label: "Spotify", icon: Music2 },
  { href: "https://pinterest.com", label: "Pinterest", icon: ImageIcon },
  { href: "https://github.com", label: "GitHub", icon: Github },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 text-center">
        <p className="font-heading text-lg text-gray-800">Bizim Koleksiyonumuz</p>

        <div className="flex gap-4">
          {SOCIALS.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-full border border-border p-2.5 text-gray-500 transition-colors hover:bg-hover hover:text-accent"
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </div>

        <Link
          href="mailto:merhaba@example.com"
          className="flex items-center gap-1.5 font-body text-sm text-gray-500 hover:text-accent"
        >
          <Mail className="h-4 w-4" />
          merhaba@example.com
        </Link>

        <p className="font-body text-xs text-gray-400">
          © {new Date().getFullYear()} Bizim Koleksiyonumuz. Sevgiyle yapıldı.
        </p>
      </div>
    </footer>
  );
}
