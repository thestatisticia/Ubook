// Profile Page Component
import { getBookings, updateBookingStatus } from '../utils/storage.js';
import { BOOKING_STATUS } from '../config/constants.js';
import { SAMPLE_ACCOMMODATIONS } from '../config/constants.js';

export class ProfilePage {
  constructor(currentUser, walletConnection) {
    this.currentUser = currentUser;
    this.walletConnection = walletConnection;
  }

  async render() {
    if (!this.walletConnection?.connected) {
      return `
        <div class="profile-page">
          <div class="auth-required">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to view your profile</p>
            <button class="btn-primary" id="connect-for-profile">Connect Wallet</button>
          </div>
        </div>
      `;
    }

    const bookings = getBookings().filter(b => b.walletAddress === this.walletConnection.address);

    return `
      <div class="profile-page">
        <div class="profile-header">
          <h1>My Profile</h1>
          <div class="wallet-info">
            <span>Address: <strong>${this.walletConnection.address.slice(0,6)}...${this.walletConnection.address.slice(-4)}</strong></span>
          </div>
        </div>

        <div class="profile-section">
          <h2>My Bookings</h2>
          ${bookings.length === 0 ? `
            <div class="no-bookings">
              <h3>No bookings yet</h3>
              <a href="#/browse" class="btn-primary">Browse Accommodations</a>
            </div>
          ` : `
            <div class="bookings-list">
              ${bookings.slice().reverse().map(booking => this.renderBookingRow(booking)).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderBookingRow(booking) {
    const accommodation = SAMPLE_ACCOMMODATIONS.find(a => a.id === booking.accommodationId);
    const canCancel = [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.DEPOSITED].includes(booking.status);
    return `
      <div class="booking-row" data-booking-id="${booking.id}">
        <div class="row-left">
          <img src="${accommodation?.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}" alt="${booking.accommodationName}" />
          <div>
            <h3>${booking.accommodationName}</h3>
            <p>📍 ${booking.accommodationLocation}</p>
            <p>${booking.nights} night(s) • Total ${booking.totalAmount} ckUSDC</p>
          </div>
        </div>
        <div class="row-right">
          <span class="status">${booking.status}</span>
          ${canCancel ? `<button class="btn-secondary btn-small cancel-booking" data-id="${booking.id}">Cancel</button>` : ''}
          <a class="btn-primary btn-small" href="#/accommodation/${booking.accommodationId}">View</a>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const connectBtn = document.getElementById('connect-for-profile');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('wallet-connect'));
      });
    }

    document.querySelectorAll('.cancel-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        updateBookingStatus(id, BOOKING_STATUS.CANCELLED);
        window.location.reload();
      });
    });
  }
}


