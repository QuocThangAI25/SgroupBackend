import multer from "multer";
import { BadRequestError } from "../core/error.response.js";

const storage = multer.memoryStorage();

// 2. Bộ lọc định dạng file ảnh hợp lệ
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Định dạng file không hợp lệ! Chỉ chấp nhận ảnh (jpeg, jpg, png, webp, gif).",
      ),
      false,
    );
  }
};

// 3. Khởi tạo Multer với memoryStorage
export const multerUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Giới hạn 10MB/file
  },
  fileFilter: imageFileFilter,
});

/**
 * Middleware upload 1 file duy nhất
 */
export const uploadSingleImage = (fieldName = "file", required = true) => {
  return (req, res, next) => {
    const upload = multerUpload.single(fieldName);

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new BadRequestError(
              "Kích thước file vượt quá giới hạn cho phép (Tối đa 10MB)!",
            ),
          );
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return next(
            new BadRequestError(
              `Field name không đúng quy định! Vui lòng đặt tên key là '${fieldName}'.`,
            ),
          );
        }
        return next(new BadRequestError(`Lỗi upload file: ${err.message}`));
      }

      if (err) {
        return next(err);
      }

      if (required && !req.file) {
        return next(
          new BadRequestError(
            `Vui lòng chọn một file để tải lên (key: '${fieldName}')!`,
          ),
        );
      }

      next();
    });
  };
};

/**
 * Middleware upload đa file (Tối đa maxCount file, mặc định 5 file)
 */
export const uploadMultipleImages = (
  fieldName = "files",
  maxCount = 5,
  required = true,
) => {
  return (req, res, next) => {
    const upload = multerUpload.array(fieldName, maxCount);

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new BadRequestError(
              "Có file vượt quá kích thước giới hạn cho phép (Tối đa 10MB)!",
            ),
          );
        }
        if (
          err.code === "LIMIT_UNEXPECTED_FILE" ||
          err.code === "LIMIT_FILE_COUNT"
        ) {
          return next(
            new BadRequestError(
              `Vượt quá số lượng file tối đa cho phép (${maxCount} file) hoặc sai tên key ('${fieldName}')!`,
            ),
          );
        }
        return next(
          new BadRequestError(`Lỗi upload danh sách file: ${err.message}`),
        );
      }

      if (err) {
        return next(err);
      }

      if (required && (!req.files || req.files.length === 0)) {
        return next(
          new BadRequestError(
            `Vui lòng chọn ít nhất một file để tải lên (key: '${fieldName}')!`,
          ),
        );
      }

      next();
    });
  };
};
