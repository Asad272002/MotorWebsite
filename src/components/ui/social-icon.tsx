import type { SocialPlatform } from "@/data/contact";

export function SocialIcon({ platform, className = "h-5 w-5" }: Readonly<{ platform: SocialPlatform; className?: string }>) {
  if (platform === "instagram") return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  if (platform === "facebook") return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6H17V3.8c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2V10H8v3h2.5v8h3.2Z" /></svg>;
  if (platform === "tiktok") return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M14.2 3h2.9c.2 1.6 1.2 2.9 2.9 3.4v2.9a7.4 7.4 0 0 1-2.9-1v6.2a6.1 6.1 0 1 1-5.3-6v3a3.1 3.1 0 1 0 2.4 3V3Z" /></svg>;
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.7 12 4.7 12 4.7s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" /></svg>;
}