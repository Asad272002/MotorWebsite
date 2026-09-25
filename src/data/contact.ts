export type SocialPlatform = "instagram" | "facebook" | "tiktok" | "youtube";

export const OW_MOTORS_FOUNDED_YEAR = 2016;
export const OW_MOTORS_YEARS_OF_SERVICE = new Date().getFullYear() - OW_MOTORS_FOUNDED_YEAR;

export const OW_MOTORS_CONTACT = {
  address: "Shop 61-A, Main Maulana Shaukat Ali Road, Township, Lahore 54000",
  mapsShareUrl: "https://share.google/rULoUwmcBWIAHMcOl",
  mapsEmbedUrl: "https://www.google.com/maps?q=Shop%2061-A%2C%20Main%20Maulana%20Shaukat%20Ali%20Road%2C%20Township%2C%20Lahore%2054000&output=embed",
  hours: [
    { days: "Monday–Saturday", time: "11:00 AM–8:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  reviewSummary: { rating: "4.0", count: 162 },
  phones: [
    { label: "Primary", display: "0322 2033399", href: "tel:+923222033399" },
    { label: "Secondary", display: "0336 0415607", href: "tel:+923360415607" },
  ],
  socialChannels: [
    { platform: "instagram" as const, label: "Instagram", handle: "@owmotors.official", href: "https://www.instagram.com/owmotors.official/", accent: "hover:border-[#E4405F] hover:bg-[#E4405F]" },
    { platform: "facebook" as const, label: "Facebook", handle: "OW Motors", href: "https://www.facebook.com/owmotors/", accent: "hover:border-[#1877F2] hover:bg-[#1877F2]" },
    { platform: "tiktok" as const, label: "TikTok", handle: "@owmotorsoffical", href: "https://www.tiktok.com/@owmotorsoffical", accent: "hover:border-near-black hover:bg-near-black" },
    { platform: "youtube" as const, label: "YouTube", handle: "OW Motors", href: "https://www.youtube.com/channel/UCoT-gXQNnk16u2yhwTNhCUg", accent: "hover:border-[#FF0000] hover:bg-[#FF0000]" },
  ],
} as const;