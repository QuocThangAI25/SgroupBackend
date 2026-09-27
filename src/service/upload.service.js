import { uploadToR2, deleteFromR2 } from "../utils/s3.helper.js";
import * as fileRepository from "../repository/file.repository.js";

/**
 * Upload 1 file đơn lẻ lên Cloudflare R2 và lưu vào Database
 */
export const uploadFileToR2 = async (file, userId = null) => {
  if (!file) return null;

  // 1. Upload file lên Cloudflare R2
  const url = await uploadToR2(file);

  // 2. Lưu thông tin file và user vào bảng files trong PostgreSQL
  const savedFile = await fileRepository.create({
    filename: file.originalname,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: url,
    uploadedBy: userId,
  });

  return savedFile;
};

/**
 * Upload danh sách nhiều file (tối đa 5 file) lên Cloudflare R2 song song và lưu vào Database
 */
export const uploadMultipleFilesToR2 = async (files, userId = null) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map((file) => uploadFileToR2(file, userId));
  return await Promise.all(uploadPromises);
};

/**
 * Xóa file trên Cloudflare R2 và xóa bản ghi trong Database
 */
export const deleteUploadedFile = async (fileIdOrUrl) => {
  if (!fileIdOrUrl) return false;

  try {
    let fileRecord = null;
    let fileUrlOrPath = fileIdOrUrl;

    // Nếu truyền vào là ID file trong DB
    if (!isNaN(fileIdOrUrl) || typeof fileIdOrUrl === "number") {
      fileRecord = await fileRepository.findById(fileIdOrUrl);
      if (fileRecord) {
        fileUrlOrPath = fileRecord.url;
      }
    }

    // Tách lấy fileKey từ URL
    const fileKey = fileUrlOrPath.includes(process.env.R2_PUBLIC_DOMAIN)
      ? fileUrlOrPath.replace(`${process.env.R2_PUBLIC_DOMAIN}/`, "")
      : fileUrlOrPath.replace(/^\/+/, "");

    // Xóa trên R2
    const isDeletedFromR2 = await deleteFromR2(fileKey);

    // Xóa record trong DB nếu thành công
    if (isDeletedFromR2 && fileRecord) {
      await fileRepository.deleteById(fileRecord.id);
    }

    return isDeletedFromR2;
  } catch (error) {
    console.error(
      `[UploadService] Không thể xóa file trên R2/DB: ${fileIdOrUrl}`,
      error.message,
    );
    return false;
  }
};
