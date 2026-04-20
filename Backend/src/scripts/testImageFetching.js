import dotenv from "dotenv";
import { fetchImages } from "../utils/imageFetcher.js";

// Load environment variables
dotenv.config();

async function testImageFetching() {
  console.log("🖼️  Testing premium image fetching for luxury furniture...\n");

  const categories = [
    "wood-furniture",
    "chairs",
    "sofas"
  ];

  for (const category of categories) {
    try {
      console.log(`📸 Fetching images for: ${category}`);
      const images = await fetchImages(category, 5); // Test with 5 images first

      console.log(`✅ Found ${images.length} premium images for ${category}`);
      console.log(`   📏 Average resolution: ${Math.round(images.reduce((sum, img) => sum + img.width, 0) / images.length)}x${Math.round(images.reduce((sum, img) => sum + img.height, 0) / images.length)}`);
      console.log(`   🏷️  Sample tags: ${images[0]?.tags?.slice(0, 3).join(", ") || "No tags"}`);
      console.log(`   📝 Sample alt text: ${images[0]?.alt?.substring(0, 50)}...`);
      console.log("");

      // Add delay between categories
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`❌ Error fetching images for ${category}:`, error.message);
    }
  }

  console.log("🎉 Image fetching test completed!");
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testImageFetching().catch(console.error);
}

export default testImageFetching;