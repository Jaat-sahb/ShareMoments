import dotenv from "dotenv";
dotenv.config();
import ImageKit, { toFile } from '@imagekit/nodejs';

const ImageKitClient = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadPostImage(fileData) {
  let response;

  try {
    response = await ImageKitClient.files.upload({
      file: await toFile(Buffer.from(fileData.buffer), 'file'),
      fileName: fileData.originalname,
      folder: "/insta-clone/posts",
    })
  } catch (error) {
    console.error(error);
    return {
      error: "Error uploading file to ImageKit",
      details: error.message,
    };
  }

  return response;
}