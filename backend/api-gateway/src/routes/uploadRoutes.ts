import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth, successResponse, ApiError } from 'shared';
import { config } from '../config';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_MB = 5;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      cb(new Error('Allowed types: JPEG, PNG, GIF, WebP'));
      return;
    }
    cb(null, true);
  },
});

function setupCloudinary(): void {
  if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });
  }
}

function uploadImageHandler(req: Request, res: Response, next: NextFunction): void {
  if (!req.file) {
    next(ApiError.badRequest('No image file provided'));
    return;
  }
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) {
    next(ApiError.internal('Image upload not configured (Cloudinary env missing)'));
    return;
  }
  setupCloudinary();

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'prims-trade-signals' },
    (err, result) => {
      if (err) {
        next(ApiError.internal(err.message ?? 'Upload failed'));
        return;
      }
      if (!result?.secure_url) {
        next(ApiError.internal('Upload failed'));
        return;
      }
      successResponse(res, { url: result.secure_url }, 'Image uploaded');
    }
  );
  const readable = Readable.from(req.file.buffer);
  readable.pipe(stream);
}

const router = Router();
router.post('/image', requireAuth, upload.single('image'), uploadImageHandler);

export default router;
