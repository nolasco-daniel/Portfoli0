import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import DevConsoleFilter from "@/components/DevConsoleFilter";
import FrozenBackground from "@/components/FrozenBackground";
import ScrollProgress from "@/components/ScrollProgress";
import MagneticTargets from "@/components/MagneticTargets";
import SeasonProvider, {
  SEASON_BOOT_SCRIPT,
} from "@/components/SeasonProvider";
import LanguageProvider, {
  LANG_BOOT_SCRIPT,
} from "@/components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const faviconUrl =
  "https://res.cloudinary.com/dphvhssec/image/upload/v1775723700/download__1_-removebg-preview_atwjto.png";

export const metadata: Metadata = {
  title: "Daniel Nolasco",
  description:
    "3D portfolio of Daniel Nolasco, a junior software developer focused on practical systems, backend development, and database-driven workflows.",
  authors: [{ name: "Daniel Nolasco" }],
  icons: {
    icon: faviconUrl,
    shortcut: faviconUrl,
    apple: faviconUrl,
  },
  openGraph: {
    title: "Daniel Nolasco - Jr. Software Developer",
    description:
      "Interactive 3D portfolio with selected projects, experience, and tech stack.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Nolasco - Jr. Software Developer",
    description:
      "Interactive 3D portfolio with selected projects, experience, and tech stack.",
  },
};

export const viewport: Viewport = {
  themeColor: "#060e1c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Run synchronously before hydration to apply the user's stored
            season + language and avoid a flash of the default values. */}
        <script dangerouslySetInnerHTML={{ __html: SEASON_BOOT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      </head>
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <DevConsoleFilter />
        <LanguageProvider>
          <SeasonProvider>
            <FrozenBackground />
            <ScrollProgress />
            {children}
            <CustomCursor />
            <MagneticTargets />
          </SeasonProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

