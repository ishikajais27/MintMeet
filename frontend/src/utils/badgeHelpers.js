// utils/badgeHelpers.js
export const getBadgeImageUrl = (imagePath) => {
  if (!imagePath) return null

  if (imagePath.startsWith('http')) {
    return imagePath // Already a full URL
  }

  // Handle generated badges
  if (imagePath.startsWith('/generated_badges/')) {
    return `${
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
    }${imagePath}`
  }

  return null
}

export const getBadgeStatus = (attendee) => {
  if (attendee.hasReceivedBadge) {
    return {
      status: 'minted',
      label: 'Minted',
      color: 'status-minted',
    }
  }

  if (attendee.hasAttended && attendee.walletAddress) {
    return {
      status: 'ready',
      label: 'Ready',
      color: 'status-ready',
    }
  }

  return {
    status: 'pending',
    label: 'Pending',
    color: 'status-pending',
  }
}
