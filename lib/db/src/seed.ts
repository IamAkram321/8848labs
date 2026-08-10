import { db } from "./index";
import { categoriesTable } from "./schema/categories";

const DEFAULT_CATEGORIES = [
  {
    name: "Door Nameplates",
    slug: "door-nameplates",
    description: "Customized door nameplates, house signs, and plaques.",
  },
  {
    name: "Keychains",
    slug: "keychains",
    description: "Custom keyrings, tags, and small utility accessories.",
  },
  {
    name: "Wall Art",
    slug: "wall-art",
    description: "Geometric wall hangings, panels, and decorative art.",
  },
  {
    name: "Lithophanes",
    slug: "lithophanes",
    description: "3D printed light-revealing photo prints and night lights.",
  },
  {
    name: "Miniatures",
    slug: "miniatures",
    description: "High-detail tabletop figures, scale models, and collectibles.",
  },
  {
    name: "Engineering Parts",
    slug: "engineering-parts",
    description: "Functional mechanical components, enclosures, and fixtures.",
  },
  {
    name: "Home Decor",
    slug: "home-decor",
    description: "3D printed accent pieces, planters, and decorative items.",
  },
];

async function seed() {
  console.log("Clearing existing categories...");
  await db.delete(categoriesTable);

  console.log("Seeding new categories...");
  for (const category of DEFAULT_CATEGORIES) {
    await db.insert(categoriesTable).values(category);
  }

  console.log("Categories re-seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Failed to seed categories:", err);
  process.exit(1);
});