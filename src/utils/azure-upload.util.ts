import { BlobServiceClient } from "@azure/storage-blob";

export class AzureUpload {
  static async uploadImageToAzure(
    connString: string,
    containerName: string,
    imageFile: Express.Multer.File,
  ) {
    if (!imageFile) return;

    const { filename } = imageFile;

    try {
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connString);

      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const blockBlobClient = containerClient.getBlockBlobClient(filename);

      await blockBlobClient.uploadFile(imageFile.path);

      return `${containerClient.url}/${filename}`;
    } catch (err) {
      console.error(err);
    }
  }
}
