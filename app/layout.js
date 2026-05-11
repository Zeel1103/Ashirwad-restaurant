import "./globals.css";

export const metadata = {
  title: "Ashirwad 2 Restaurant & Banquet | Best Veg Restaurant in Ankleshwar",
  description: "Ashirwad 2 Restaurant & Banquet - Premium pure vegetarian dining in Ankleshwar. Enjoy authentic Punjabi food, thali, banquet hall for events. Rated 4.5⭐ by 300+ customers. Order now!",
  keywords: "best veg restaurant in Ankleshwar, Punjabi food near me, banquet hall in Ankleshwar, vegetarian restaurant Ankleshwar, Ashirwad restaurant",
  openGraph: {
    title: "Ashirwad 2 Restaurant & Banquet | Best Veg Restaurant in Ankleshwar",
    description: "Premium pure vegetarian dining experience with authentic Punjabi flavors. Banquet hall available for events.",
    type: "website",
    locale: "en_IN",
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Ashirwad 2 Restaurant & Banquet",
  image: "/images/hero-food.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Near Railway Station, Opposite Lords Plaza",
    addressLocality: "Ankleshwar",
    addressRegion: "Gujarat",
    postalCode: "393001",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 21.6264, longitude: 73.0152 },
  url: "https://ashirwad2restaurant.com",
  telephone: "+918511575440",
  servesCuisine: ["Indian", "Punjabi", "Vegetarian"],
  priceRange: "₹200-₹400",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.5", reviewCount: "300" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    opens: "10:00", closes: "23:00",
  },
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
