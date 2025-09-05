const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../uploads/csv'),
    path.join(__dirname, '../uploads/images'),
    path.join(__dirname, '../uploads/temp'),
  ]

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

ensureUploadDirs()

// Configure storage for CSV files
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/csv'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'csv-' + uniqueSuffix + path.extname(file.originalname))
  },
})

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/images'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter for CSV
const csvFilter = (req, file, cb) => {
  if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel'
  ) {
    cb(null, true)
  } else {
    cb(new Error('Only CSV files are allowed'), false)
  }
}

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

// Create upload instances
const uploadCSV = multer({
  storage: csvStorage,
  fileFilter: csvFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        error: err.message,
      })
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: 'Upload failed',
      error: err.message,
    })
  }

  next()
}

module.exports = {
  uploadCSV,
  uploadImage,
  handleUploadError,
}
