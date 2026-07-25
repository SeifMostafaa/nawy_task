import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const apartments = [
  {
    unitName: "Sunrise Loft",
    unitNumber: "A-101",
    project: "Palm Hills",
    price: 2_450_000,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    address: "6th of October City, Giza",
    description:
      "Bright corner unit on the ground floor with a private garden and direct pool access.\n\nOpen-plan living and dining area with floor-to-ceiling windows.\n\nFive-minute walk to the community clubhouse and gym.",
    imageUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
    ],
  },
  {
    unitName: "Marina View",
    unitNumber: "B-304",
    project: "Mountain View iCity",
    price: 3_800_000,
    bedrooms: 3,
    bathrooms: 3,
    area: 175,
    address: "New Cairo, Cairo",
    description:
      "Top-floor apartment with panoramic views over the central lagoon and skyline.\n\nFully fitted kitchen with built-in appliances.\n\nTwo covered parking spots included.",
    imageUrls: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
    ],
  },
  {
    unitName: "Garden Suite",
    unitNumber: "C-12",
    project: "Palm Hills",
    price: 1_950_000,
    bedrooms: 1,
    bathrooms: 1,
    area: 85,
    address: "6th of October City, Giza",
    description:
      "Cozy one-bedroom unit facing the landscaped courtyard, ideal for first-time buyers.\n\nBuilt-in wardrobes and a compact home-office nook.\n\nLow-maintenance building with 24/7 security.",
    imageUrls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800",
    ],
  },
  {
    unitName: "Skyline Duplex",
    unitNumber: "D-701",
    project: "Zed East",
    price: 6_200_000,
    bedrooms: 4,
    bathrooms: 4,
    area: 280,
    address: "New Cairo, Cairo",
    description:
      "Two-story duplex with a private rooftop terrace and full skyline views.\n\nMaster suite with a walk-in closet and en-suite bathroom.\n\nSmart-home lighting and climate control pre-installed.",
    imageUrls: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=800",
    ],
  },
  {
    unitName: "Palm Residence",
    unitNumber: "A-205",
    project: "Mountain View iCity",
    price: 2_900_000,
    bedrooms: 2,
    bathrooms: 2,
    area: 135,
    address: "New Cairo, Cairo",
    description:
      "Modern finishing, walk-in closet, and a balcony overlooking the central park.\n\nPorcelain flooring throughout with underfloor heating in the bathrooms.\n\nDedicated storage room on the same floor.",
    imageUrls: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    ],
  },
  {
    unitName: "Lakefront Studio",
    unitNumber: "E-9",
    project: "Zed East",
    price: 1_400_000,
    bedrooms: 1,
    bathrooms: 1,
    area: 60,
    address: "New Cairo, Cairo",
    description:
      "Compact studio steps away from the artificial lake, perfect as a rental investment.\n\nMurphy bed and space-saving built-in furniture included.\n\nShared rooftop lounge with lake views.",
    imageUrls: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800",
    ],
  },
];

async function main() {
  const count = await prisma.apartment.count();
  if (count > 0) {
    console.log(`Seed skipped — ${count} apartment(s) already in the DB.`);
    return;
  }

  await prisma.apartment.createMany({ data: apartments });
  console.log(`Seeded ${apartments.length} apartments.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
