import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

// Khởi tạo S3 Client kết nối Cloudflare R2
export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Hàm upload 1 file lên Cloudflare R2
 * @param {Object} file - File object từ Multer (dạng buffer)
 * @returns {String} URL công khai của file
 */
export const uploadToR2 = async (file) => {
  // Tạo tên file độc nhất để không bị đè file cũ
  const fileKey = `uploads/${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  // Trả về link public dạng: https://pub-xxxx.r2.dev/uploads/123456-file.pdf
  return `${process.env.R2_PUBLIC_DOMAIN}/${fileKey}`;
};

/**
 * Hàm xóa 1 file khỏi Cloudflare R2
 * @param {String} fileKey - Key của file trên R2 (vd: uploads/1700000000-image.png)
 * @returns {Boolean}
 */
export const deleteFromR2 = async (fileKey) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Lỗi xóa file trên Cloudflare R2:", error.message);
    return false;
  }
};
