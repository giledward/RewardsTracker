import "./globals.css";

export const metadata = {
  title: "BONK Rewards Tracker",
  description: "Live BONK rewards dashboard for lockers"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
