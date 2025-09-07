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
// const csvStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads/csv'))
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
//     cb(null, 'csv-' + uniqueSuffix + path.extname(file.originalname))
//   },
// })
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

// File filter for CSV - more lenient
// const csvFilter = (req, file, cb) => {
//   // Allow various CSV mime types and also check file extension
//   const allowedMimeTypes = [
//     'text/csv',
//     'application/vnd.ms-excel',
//     'application/csv',
//     'text/x-csv',
//     'application/x-csv',
//     'text/comma-separated-values',
//     'text/x-comma-separated-values',
//     'application/octet-stream', // Added for better compatibility
//   ]

//   const allowedExtensions = ['.csv']
//   const fileExtension = path.extname(file.originalname).toLowerCase()

//   if (
//     allowedMimeTypes.includes(file.mimetype) ||
//     allowedExtensions.includes(fileExtension)
//   ) {
//     cb(null, true)
//   } else {
//     cb(new Error('Only CSV files are allowed'), false)
//   }
// }
const csvFilter = (req, file, cb) => {
  console.log('File received:', file.originalname, 'MIME type:', file.mimetype)

  // Allow ALL file types for debugging
  cb(null, true)

  /* Original code (commented out for debugging):
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/csv',
    'text/x-csv',
    'application/x-csv',
    'text/comma-separated-values',
    'text/x-comma-separated-values',
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  const allowedExtensions = ['.csv', '.xlsx', '.xls']
  const fileExtension = path.extname(file.originalname).toLowerCase()

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Received: ${file.mimetype}, ${fileExtension}`), false)
  }
  */
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
// const uploadCSV = multer({
//   storage: csvStorage,
//   fileFilter: csvFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
// })
const uploadCSV = multer({
  storage: csvStorage,
  fileFilter: csvFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// Error handling middleware for multer - FIXED
// const handleUploadError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         success: false,
//         message: 'File too large',
//         error: err.message,
//       })
//     }
//     if (err.code === 'LIMIT_UNEXPECTED_FILE') {
//       return res.status(400).json({
//         success: false,
//         message: 'Unexpected file field',
//         error: err.message,
//       })
//     }
//   }

//   if (err) {
//     return res.status(400).json({
//       success: false,
//       message: 'Upload failed',
//       error: err.message,
//     })
//   }

//   next()
// }
const handleUploadError = (err, req, res, next) => {
  console.log('Upload error:', err.message)

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        error: err.message,
      })
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field',
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
