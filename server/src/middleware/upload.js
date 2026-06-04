import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'
import fs from 'fs'
import path from 'path'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf', 'video/mp4', 'video/webm']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

// ── Local Storage Setup (Fallback) ───────────────────────────────────────────
if (!isCloudinaryConfigured) {
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true })
  }
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || `.${file.mimetype.split('/')[1] || 'bin'}`
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  },
})

// ── Cloudinary Storage Setup ─────────────────────────────────────────────────
const avatarStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'bartr/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
      },
    })
  : null

const portfolioStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: (req, file) => ({
        folder: 'bartr/portfolios',
        resource_type: file.mimetype.startsWith('video/') ? 'video' : 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'mp4', 'webm'],
      }),
    })
  : null

const messageStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: (req, file) => ({
        folder: 'bartr/messages',
        resource_type: file.mimetype.startsWith('video/') ? 'video' : (file.mimetype.startsWith('image/') ? 'image' : 'raw'),
      }),
    })
  : null

const fileFilter = (allowed) => (req, file, cb) => {
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowed.join(', ')}`), false)
  }
}

// ── Middleware Wrappers ──────────────────────────────────────────────────────
const wrapUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err) return next(err)
    if (req.file && !isCloudinaryConfigured) {
      req.file.path = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    }
    next()
  })
}

export const uploadAvatar = wrapUpload(
  multer({
    storage: isCloudinaryConfigured ? avatarStorage : diskStorage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
  }).single('avatar')
)

export const uploadPortfolio = wrapUpload(
  multer({
    storage: isCloudinaryConfigured ? portfolioStorage : diskStorage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter(ALLOWED_FILE_TYPES),
  }).single('file')
)

export const uploadMessageFile = wrapUpload(
  multer({
    storage: isCloudinaryConfigured ? messageStorage : diskStorage,
    limits: { fileSize: MAX_FILE_SIZE },
  }).single('file')
)

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' })
    }
    return res.status(400).json({ success: false, message: err.message })
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
  next()
}
