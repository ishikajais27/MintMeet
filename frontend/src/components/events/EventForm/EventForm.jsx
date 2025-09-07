// import React, { useState } from 'react'
// import Button from '../../common/Button/Button'
// import Loader from '../../common/Loader/Loader'
// import Notification from '../../common/Notification/Notification'
// import './EventForm.css'

// const EventForm = ({ onSubmit, loading = false }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     date: '',
//     organizer: '', // Ensure this is initialized as empty string
//     image: null,
//   })
//   const [errors, setErrors] = useState({})
//   const [notification, setNotification] = useState({
//     show: false,
//     message: '',
//     type: '',
//   })

//   const handleChange = (e) => {
//     const { name, value, files } = e.target

//     if (name === 'image') {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }))
//     } else {
//       // Ensure we're setting a string value, not undefined
//       setFormData((prev) => ({ ...prev, [name]: value || '' }))
//     }

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     if (!formData.name.trim()) {
//       newErrors.name = 'Event name is required'
//     }

//     if (!formData.date) {
//       newErrors.date = 'Event date is required'
//     } else if (new Date(formData.date) < new Date()) {
//       newErrors.date = 'Event date must be in the future'
//     }

//     if (!formData.organizer.trim()) {
//       newErrors.organizer = 'Organizer name is required'
//     }

//     if (!formData.image) {
//       newErrors.image = 'Event image is required'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     try {
//       await onSubmit(formData)
//       setNotification({
//         show: true,
//         message: 'Event created successfully!',
//         type: 'success',
//       })

//       // Reset form - ensure all fields are set to empty strings
//       setFormData({
//         name: '',
//         date: '',
//         organizer: '',
//         image: null,
//       })

//       // Reset the file input
//       const fileInput = document.getElementById('image')
//       if (fileInput) {
//         fileInput.value = ''
//       }

//       // Hide notification after 3 seconds
//       setTimeout(
//         () => setNotification({ show: false, message: '', type: '' }),
//         3000
//       )
//     } catch (error) {
//       setNotification({
//         show: true,
//         message: error.message || 'Failed to create event',
//         type: 'error',
//       })
//     }
//   }

//   return (
//     <div className="event-form-container">
//       <Notification
//         message={notification.message}
//         type={notification.type}
//         isVisible={notification.show}
//         onClose={() => setNotification({ show: false, message: '', type: '' })}
//       />

//       <form className="event-form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="name" className="form-label">
//             Event Name *
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className={`form-input ${errors.name ? 'form-input--error' : ''}`}
//             placeholder="Enter event name"
//             disabled={loading}
//           />
//           {errors.name && <span className="form-error">{errors.name}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="organizer" className="form-label">
//             Organizer Name *
//           </label>
//           <input
//             type="text"
//             id="organizer"
//             name="organizer"
//             value={formData.organizer}
//             onChange={handleChange}
//             className={`form-input ${
//               errors.organizer ? 'form-input--error' : ''
//             }`}
//             placeholder="Enter organizer name"
//             disabled={loading}
//           />
//           {errors.organizer && (
//             <span className="form-error">{errors.organizer}</span>
//           )}
//         </div>

//         <div className="form-group">
//           <label htmlFor="date" className="form-label">
//             Event Date *
//           </label>
//           <input
//             type="date"
//             id="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             className={`form-input ${errors.date ? 'form-input--error' : ''}`}
//             disabled={loading}
//           />
//           {errors.date && <span className="form-error">{errors.date}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="image" className="form-label">
//             Event Image *
//           </label>
//           <input
//             type="file"
//             id="image"
//             name="image"
//             accept="image/*"
//             onChange={handleChange}
//             className={`form-input ${errors.image ? 'form-input--error' : ''}`}
//             disabled={loading}
//           />
//           {errors.image && <span className="form-error">{errors.image}</span>}
//           {formData.image && (
//             <div className="image-preview">
//               <img
//                 src={URL.createObjectURL(formData.image)}
//                 alt="Preview"
//                 className="image-preview__img"
//               />
//               <span className="image-preview__name">{formData.image.name}</span>
//             </div>
//           )}
//         </div>

//         <Button
//           type="submit"
//           variant="primary"
//           size="large"
//           disabled={loading}
//           className="submit-button"
//         >
//           {loading ? <Loader size="small" /> : 'Create Event'}
//         </Button>
//       </form>
//     </div>
//   )
// }

// export default EventForm
import React, { useState } from 'react'
import Button from '../../common/Button/Button'
import Loader from '../../common/Loader/Loader'
import Notification from '../../common/Notification/Notification'
import './EventForm.css'

const EventForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    organizer: '',
    description: '',
    image: null,
  })
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'image') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value || '' }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required'
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required'
    } else if (new Date(formData.date) < new Date()) {
      newErrors.date = 'Event date must be in the future'
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()

  //   if (!validateForm()) {
  //     return
  //   }

  //   try {
  //     await onSubmit(formData)
  //     setNotification({
  //       show: true,
  //       message: 'Event created successfully!',
  //       type: 'success',
  //     })

  //     // Reset form
  //     setFormData({
  //       name: '',
  //       date: '',
  //       organizer: '',
  //       description: '',
  //       image: null,
  //     })

  //     // Reset the file input
  //     const fileInput = document.getElementById('image')
  //     if (fileInput) {
  //       fileInput.value = ''
  //     }

  //     // Hide notification after 3 seconds
  //     setTimeout(
  //       () => setNotification({ show: false, message: '', type: '' }),
  //       3000
  //     )
  //   } catch (error) {
  //     setNotification({
  //       show: true,
  //       message: error.message || 'Failed to create event',
  //       type: 'error',
  //     })
  //   }
  // }
  // EventForm.jsx - Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // Create FormData to handle file upload
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('date', formData.date)
      submitData.append('organizer', formData.organizer)
      submitData.append('description', formData.description)

      if (formData.image) {
        submitData.append('image', formData.image)
      }

      await onSubmit(submitData) // Pass FormData instead of regular object

      setNotification({
        show: true,
        message: 'Event created successfully!',
        type: 'success',
      })

      // Reset form
      setFormData({
        name: '',
        date: '',
        organizer: '',
        description: '',
        image: null,
      })

      // Reset the file input
      const fileInput = document.getElementById('image')
      if (fileInput) {
        fileInput.value = ''
      }

      // Hide notification after 3 seconds
      setTimeout(
        () => setNotification({ show: false, message: '', type: '' }),
        3000
      )
    } catch (error) {
      setNotification({
        show: true,
        message: error.message || 'Failed to create event',
        type: 'error',
      })
    }
  }
  return (
    <div className="event-form-container">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ show: false, message: '', type: '' })}
      />

      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Event Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            placeholder="Enter event name"
            disabled={loading}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="organizer" className="form-label">
            Organizer Name *
          </label>
          <input
            type="text"
            id="organizer"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            className={`form-input ${
              errors.organizer ? 'form-input--error' : ''
            }`}
            placeholder="Enter organizer name"
            disabled={loading}
          />
          {errors.organizer && (
            <span className="form-error">{errors.organizer}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Event Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-input ${errors.date ? 'form-input--error' : ''}`}
            disabled={loading}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter event description (optional)"
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Event Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className={`form-input ${errors.image ? 'form-input--error' : ''}`}
            disabled={loading}
          />
          {errors.image && <span className="form-error">{errors.image}</span>}
          {formData.image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="image-preview__img"
              />
              <span className="image-preview__name">{formData.image.name}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={loading}
          className="submit-button"
        >
          {loading ? <Loader size="small" /> : 'Create Event'}
        </Button>
      </form>
    </div>
  )
}

export default EventForm
