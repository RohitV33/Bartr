import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf', 'video/mp4', 'video/webm']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bartr/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
})

const portfolioStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'bartr/portfolios',
    resource_type: file.mimetype.startsWith('video/') ? 'video' : 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'mp4', 'webm'],
  }),
})

const fileFilter = (allowed) => (req, file, cb) => {
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowed.join(', ')}`), false)
  }
}

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
}).single('avatar')

export const uploadPortfolio = multer({
  storage: portfolioStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter(ALLOWED_FILE_TYPES),
}).single('file')

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
