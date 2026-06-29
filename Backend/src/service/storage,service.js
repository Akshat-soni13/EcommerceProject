import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
    privateKey: config.IMAGE_KIT_PRIVATE_KEY,
    publicKey: config.IMAGE_KIT_PUBLIC_KEY,
    urlEndpoint: config.IMAGE_KIT_URL_ENDPOINT
});


export async function uploadImageToImageKit({
  buffer,
  filename,
  folder = "KrishnaFashion",
}) {
  try {
    console.log("Uploading image to ImageKit:", { filename, folder });
    const result = await client.files.upload({
      file: await ImageKit.toFile(buffer),
      fileName: filename,
      folder,
    });
    console.log("Image uploaded successfully:", result);



    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}