import React, { useRef, useState } from 'react'
import Button from '../../common/Button/Button'
import Loader from '../../common/Loader/Loader'
import './CSVUploader.css'

const CSVUploader = ({ onUpload, loading = false }) => {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file)
      }
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      // Parse CSV file
      const text = await readFileAsText(selectedFile)
      const parsedData = parseCSV(text)

      // Validate and format data
      const attendeesData = parsedData.map((row, index) => ({
        name: row.name || row.Name || row.NAME || `Attendee ${index + 1}`,
        email: row.email || row.Email || row.EMAIL || '',
        walletAddress:
          row.wallet ||
          row.Wallet ||
          row.WALLET ||
          row.address ||
          row.Address ||
          row.ADDRESS ||
          '',
      }))

      console.log('Parsed CSV data:', attendeesData)
      await onUpload(attendeesData)

      // Reset after successful upload
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error processing CSV:', error)
      throw error
    }
  }

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  const parseCSV = (text) => {
    const lines = text.split('\n').filter((line) => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0]
      .split(',')
      .map((header) => header.trim().toLowerCase())
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((value) => value.trim())
      if (values.some((v) => v)) {
        // Skip empty lines
        const row = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        data.push(row)
      }
    }

    return data
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="csv-uploader">
      <div className="csv-uploader-header">
        <h3 className="csv-uploader-title">Upload Attendees CSV</h3>
        <p className="csv-uploader-description">
          Upload a CSV file with columns: name, email, walletAddress
        </p>
      </div>

      <div
        className={`csv-uploader-dropzone ${
          dragActive ? 'csv-uploader-dropzone--active' : ''
        } ${selectedFile ? 'csv-uploader-dropzone--has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="csv-uploader-input"
        />

        {selectedFile ? (
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
              Drag & drop your CSV file here, or{' '}
              <span className="csv-uploader-browse">browse</span>
            </p>
            <p className="csv-uploader-hint">
              Supported format: CSV with name, email, and wallet address columns
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
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
