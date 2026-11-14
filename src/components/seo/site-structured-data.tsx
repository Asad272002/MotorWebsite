import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { OW_MOTORS_CONTACT, OW_MOTORS_FOUNDED_YEAR, OW_MOTORS_PUBLIC_EMAIL } from "@/data/contact";

export function SiteStructuredData() {
  const organizationId = `${SITE_URL}/#organization`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MotorcycleDealer",
        "@id": organizationId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/ow-motors-logo.png`,
        image: `${SITE_URL}/images/home/taro-campaign-03.webp`,
        description: SITE_DESCRIPTION,
        foundingDate: String(OW_MOTORS_FOUNDED_YEAR),
        telephone: "+923222033399",
        email: OW_MOTORS_PUBLIC_EMAIL,
        currenciesAccepted: "PKR",
        priceRange: "PKR",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Shop 61-A, Main Maulana Shaukat Ali Road, Township",
          addressLocality: "Lahore",
          postalCode: "54000",
          addressCountry: "PK",
        },
        hasMap: OW_MOTORS_CONTACT.mapsShareUrl,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "11:00",
            closes: "20:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "00:00",
            closes: "00:00",
          },
        ],
        sameAs: OW_MOTORS_CONTACT.socialChannels.map((channel) => channel.href),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { "@id": organizationId },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replaceAll("<", "\\u003c") }}
    />
  );
}
