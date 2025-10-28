// Local Storage Management for User Data and Bookings

/**
 * Store user data in local storage
 * @param {Object} userData - User information
 */
export function storeUserData(userData) {
  try {
    localStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
}

/**
 * Get user data from local storage
 * @returns {Object|null} User data or null
 */
export function getUserData() {
  try {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

/**
 * Store booking in local storage
 * @param {Object} booking - Booking information
 */
export function storeBooking(booking) {
  try {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
  } catch (error) {
    console.error('Error storing booking:', error);
  }
}

/**
 * Get all bookings from local storage
 * @returns {Array} Array of bookings
 */
export function getBookings() {
  try {
    const data = localStorage.getItem('bookings');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
}

/**
 * Update booking status
 * @param {number} bookingId - Booking ID
 * @param {string} status - New status
 */
export function updateBookingStatus(bookingId, status) {
  try {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = status;
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
  }
}

/**
 * Get booking by ID
 * @param {number} bookingId - Booking ID
 * @returns {Object|null} Booking or null
 */
export function getBookingById(bookingId) {
  try {
    const bookings = getBookings();
    return bookings.find(b => b.id === bookingId) || null;
  } catch (error) {
    console.error('Error getting booking:', error);
    return null;
  }
}

/**
 * Clear all data (logout)
 */
export function clearAllData() {
  try {
    localStorage.removeItem('userData');
    localStorage.removeItem('bookings');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

/**
 * Check if user is logged in
 * @returns {boolean} True if logged in
 */
export function isLoggedIn() {
  const userData = getUserData();
  return userData !== null && userData.address !== null;
}

/**
 * Store wallet connection
 * @param {Object} walletData - Wallet connection data
 */
export function storeWalletConnection(walletData) {
  try {
    localStorage.setItem('walletConnection', JSON.stringify(walletData));
  } catch (error) {
    console.error('Error storing wallet connection:', error);
  }
}

/**
 * Get wallet connection
 * @returns {Object|null} Wallet connection data or null
 */
export function getWalletConnection() {
  try {
    const data = localStorage.getItem('walletConnection');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting wallet connection:', error);
    return null;
  }
}



