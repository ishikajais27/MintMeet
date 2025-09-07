// import React, { useRef, useState } from 'react'
// import Button from '../../common/Button/Button'
// import Loader from '../../common/Loader/Loader'
// import './CSVUploader.css'

// const CSVUploader = ({ onUpload, loading = false, eventId }) => {
//   const fileInputRef = useRef(null)
//   const [dragActive, setDragActive] = useState(false)
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [uploadError, setUploadError] = useState(null)

//   const handleDrag = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true)
//     } else if (e.type === 'dragleave') {
//       setDragActive(false)
//     }
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragActive(false)

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0]
//       if (
//         file.type === 'text/csv' ||
//         file.name.endsWith('.csv') ||
//         file.name.endsWith('.xlsx') ||
//         file.name.endsWith('.xls')
//       ) {
//         setSelectedFile(file)
//         setUploadError(null)
//       }
//     }
//   }

//   const handleFileSelect = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0])
//       setUploadError(null)
//     }
//   }
//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setUploadError('Please select a file')
//       return
//     }

//     if (!eventId) {
//       setUploadError(
//         'Event ID is missing. Please refresh the page and try again.'
//       )
//       return
//     }

//     setUploadError(null) // Clear previous errors

//     try {
//       // Create FormData for file upload
//       const formData = new FormData()
//       formData.append('csvFile', selectedFile)
//       formData.append('eventId', eventId)

//       console.log('Uploading CSV for event:', eventId)

//       await onUpload(formData)

//       // Reset after successful upload
//       setSelectedFile(null)
//       setUploadError(null)
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''
//       }
//     } catch (error) {
//       console.error('Error uploading CSV:', error)
//       setUploadError(error.message || 'Failed to upload CSV file')
//       throw error
//     }
//   }

//   const handleRemoveFile = () => {
//     setSelectedFile(null)
//     setUploadError(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   // Debug function to check FormData contents
//   const debugFormData = (formData) => {
//     console.log('FormData contents:')
//     for (let [key, value] of formData.entries()) {
//       console.log(key, value)
//     }
//   }

//   // const debugFormData = (formData) => {
//   //   console.log('FormData contents:')
//   //   for (let [key, value] of formData.entries()) {
//   //     console.log(key, value)
//   //   }
//   // }
//   // const handleUpload = async () => {
//   //   if (!selectedFile || !eventId) {
//   //     setUploadError(!eventId ? 'Event ID is missing' : 'Please select a file')
//   //     return
//   //   }
//   //   if (!eventId) {
//   //     setUploadError(
//   //       'Event ID is missing. Please refresh the page and try again.'
//   //     )
//   //     return
//   //   }

//   //   setUploadError(null)
//   //   try {
//   //     const formData = new FormData()
//   //     formData.append('csvFile', selectedFile)
//   //     formData.append('eventId', eventId)

//   //     // Debug what's being sent
//   //     debugFormData(formData)

//   //     await onUpload(formData)

//   //     setSelectedFile(null)
//   //     setUploadError(null)
//   //     if (fileInputRef.current) {
//   //       fileInputRef.current.value = ''
//   //     }
//   //   } catch (error) {
//   //     console.error('Error uploading CSV:', error)
//   //     setUploadError(error.message)
//   //     throw error
//   //   }
//   // }

//   // const handleRemoveFile = () => {
//   //   setSelectedFile(null)
//   //   setUploadError(null)
//   //   if (fileInputRef.current) {
//   //     fileInputRef.current.value = ''
//   //   }
//   // }
//   return (
//     <div className="csv-uploader">
//       <div className="csv-uploader-header">
//         <h3 className="csv-uploader-title">Upload Attendees CSV</h3>
//         <p className="csv-uploader-description">
//           Upload a CSV or Excel file with columns: name, email, walletAddress
//         </p>
//       </div>

//       <div
//         className={`csv-uploader-dropzone ${
//           dragActive ? 'csv-uploader-dropzone--active' : ''
//         } ${selectedFile ? 'csv-uploader-dropzone--has-file' : ''}`}
//         onDragEnter={handleDrag}
//         onDragLeave={handleDrag}
//         onDragOver={handleDrag}
//         onDrop={handleDrop}
//         onClick={() => fileInputRef.current?.click()}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept=".csv,.xlsx,.xls"
//           onChange={handleFileSelect}
//           className="csv-uploader-input"
//         />

//         {selectedFile ? (
//           <div className="csv-uploader-file">
//             <div className="csv-uploader-file-info">
//               <span className="csv-uploader-file-name">
//                 {selectedFile.name}
//               </span>
//               <span className="csv-uploader-file-size">
//                 ({(selectedFile.size / 1024).toFixed(1)} KB)
//               </span>
//             </div>
//             <Button
//               variant="outline"
//               size="small"
//               onClick={handleRemoveFile}
//               disabled={loading}
//             >
//               Remove
//             </Button>
//           </div>
//         ) : (
//           <div className="csv-uploader-placeholder">
//             <div className="csv-uploader-icon">📄</div>
//             <p className="csv-uploader-text">
//               Drag & drop your CSV or Excel file here, or{' '}
//               <span className="csv-uploader-browse">browse</span>
//             </p>
//             <p className="csv-uploader-hint">
//               Supported formats: CSV, XLSX with name, email, and wallet address
//               columns
//             </p>
//           </div>
//         )}
//       </div>

//       {selectedFile && (
//         <div className="csv-uploader-actions">
//           <Button
//             onClick={handleUpload}
//             disabled={loading || !selectedFile}
//             className="csv-uploader-button"
//           >
//             {loading ? <Loader size="small" /> : 'Upload Attendees'}
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }
// export default CSVUploader
import React, { useRef, useState } from 'react'
import Button from '../../common/Button/Button'
import Loader from '../../common/Loader/Loader'
import './CSVUploader.css'

const CSVUploader = ({ onUpload, loading = false, eventId }) => {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false) // Add success state

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setUploadSuccess(false) // Reset success on new file drop

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (
        file.type === 'text/csv' ||
        file.name.endsWith('.csv') ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')
      ) {
        setSelectedFile(file)
        setUploadError(null)
      }
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadError(null)
      setUploadSuccess(false) // Reset success on new file selection
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file')
      return
    }

    if (!eventId) {
      setUploadError(
        'Event ID is missing. Please refresh the page and try again.'
      )
      return
    }

    setUploadError(null)
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append('csvFile', selectedFile)
      formData.append('eventId', eventId)

      console.log('Uploading CSV for event:', eventId)

      const response = await onUpload(formData)

      // Check if upload was successful
      if (response && response.success) {
        setUploadSuccess(true)
        // Auto-reset after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false)
        }, 3000)
      }

      // Reset file selection
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading CSV:', error)
      setUploadError(error.message || 'Failed to upload CSV file')
      throw error
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadError(null)
    setUploadSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="csv-uploader">
      <div className="csv-uploader-header">
        <h3 className="csv-uploader-title">Upload Attendees CSV</h3>
        <p className="csv-uploader-description">
          Upload a CSV or Excel file with columns: name, email, walletAddress
        </p>
      </div>

      <div
        className={`csv-uploader-dropzone ${
          dragActive ? 'csv-uploader-dropzone--active' : ''
        } ${selectedFile ? 'csv-uploader-dropzone--has-file' : ''} ${
          uploadSuccess ? 'csv-uploader-dropzone--success' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="csv-uploader-input"
        />

        {uploadSuccess ? (
          <div className="csv-uploader-success">
            <div className="csv-uploader-success-icon">✅</div>
            <p className="csv-uploader-success-text">
              CSV uploaded successfully!
            </p>
          </div>
        ) : selectedFile ? (
          <div className="csv-uploader-file">
            <div className="csv-uploader-file-info">
              <span className="csv-uploader-file-name">
                {selectedFile.name}
              </span>
              <span className="csv-uploader-file-size">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={handleRemoveFile}
              disabled={loading}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="csv-uploader-placeholder">
            <div className="csv-uploader-icon">📄</div>
            <p className="csv-uploader-text">
              Drag & drop your CSV or Excel file here, or{' '}
              <span className="csv-uploader-browse">browse</span>
            </p>
            <p className="csv-uploader-hint">
              Supported formats: CSV, XLSX with name, email, and wallet address
              columns
            </p>
          </div>
        )}
      </div>

      {/* Error display */}
      {uploadError && (
        <div className="csv-uploader-error">
          <p className="error-message">{uploadError}</p>
        </div>
      )}

      {selectedFile && !uploadSuccess && (
        <div className="csv-uploader-actions">
          <Button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="csv-uploader-button"
          >
            {loading ? <Loader size="small" /> : 'Upload Attendees'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default CSVUploader
