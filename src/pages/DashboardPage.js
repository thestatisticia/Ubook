// Dashboard Page Component
import { getBookings, getUserData } from '../utils/storage.js';
import { BOOKING_STATUS } from '../config/constants.js';
import { SAMPLE_ACCOMMODATIONS } from '../config/constants.js';

export class DashboardPage {
  constructor(currentUser, walletConnection) {
    this.currentUser = currentUser;
    this.walletConnection = walletConnection;
  }

  render() {
    if (!this.walletConnection?.connected) {
      return `
        <div class="dashboard-page">
          <div class="auth-required">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to view your bookings</p>
            <button class="btn-primary" id="connect-for-dashboard">Connect Wallet</button>
          </div>
        </div>
      `;
    }

    const bookings = getBookings();
    const userBookings = bookings.filter(b => b.walletAddress === this.walletConnection.address);
    const bookingsByStatus = this.groupBookingsByStatus(userBookings);

    return `
      <div class="dashboard-page">
        <div class="dashboard-header">
          <h1>My Bookings</h1>
          <div class="wallet-info">
            <span>Connected: <strong>${this.walletConnection.address.slice(0, 6)}...${this.walletConnection.address.slice(-4)}</strong></span>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon"></div>
            <div class="stat-info">
              <div class="stat-value">${userBookings.length}</div>
              <div class="stat-label">Total Bookings</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"></div>
            <div class="stat-info">
              <div class="stat-value">${bookingsByStatus[BOOKING_STATUS.PENDING] || 0}</div>
              <div class="stat-label">Pending</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"></div>
            <div class="stat-info">
              <div class="stat-value">${bookingsByStatus[BOOKING_STATUS.CONFIRMED] || 0}</div>
              <div class="stat-label">Confirmed</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"></div>
            <div class="stat-info">
              <div class="stat-value">${bookingsByStatus[BOOKING_STATUS.COMPLETED] || 0}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>
        </div>

        <div class="bookings-section">
          <h2>Recent Bookings</h2>
          ${userBookings.length === 0 ? `
            <div class="no-bookings">
              <div class="empty-icon"></div>
              <h3>No bookings yet</h3>
          <p>Start exploring accommodations in Uganda</p>
            </div>
          ` : `
            <div class="bookings-list">
              ${userBookings.slice().reverse().map(booking => this.renderBookingCard(booking)).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderBookingCard(booking) {
    const accommodation = SAMPLE_ACCOMMODATIONS.find(a => a.id === booking.accommodationId);
    
    const statusColors = {
      pending: 'orange',
      confirmed: 'blue',
      deposited: 'purple',
      completed: 'green',
      cancelled: 'red'
    };

    const statusLabels = {
      pending: 'Pending Deposit',
      confirmed: 'Confirmed',
      deposited: 'Deposited - Awaiting Check-in',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };

    return `
      <div class="booking-card" data-booking-id="${booking.id}">
        <div class="booking-image">
          <img src="${accommodation?.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}" alt="${booking.accommodationName}">
          <div class="booking-status" style="background: ${statusColors[booking.status] || 'gray'}">
            ${statusLabels[booking.status] || booking.status}
          </div>
        </div>
        <div class="booking-details">
          <h3>${booking.accommodationName}</h3>
          <p class="booking-location">📍 ${booking.accommodationLocation}</p>
          <div class="booking-info">
            <div class="info-item">
              <strong>Check-in:</strong> ${this.formatDate(booking.checkIn)}
            </div>
            <div class="info-item">
              <strong>Check-out:</strong> ${this.formatDate(booking.checkOut)}
            </div>
            <div class="info-item">
              <strong>Duration:</strong> ${booking.nights} night${booking.nights > 1 ? 's' : ''}
            </div>
          </div>
          <div class="booking-payment">
            <div class="price-detail">
              <span>${booking.pricePerNight} ckUSDC × ${booking.nights} nights</span>
              <span class="total-price">${booking.totalAmount} ckUSDC</span>
            </div>
            ${booking.status === BOOKING_STATUS.PENDING ? `
              <button class="btn-primary btn-small" onclick="window.location.hash='#/accommodation/${booking.accommodationId}'">
                Complete Deposit
              </button>
            ` : ''}
            ${(() => {
              const now = Date.now();
              const canCancel = new Date(booking.checkIn).getTime() > now && [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.DEPOSITED].includes(booking.status);
              return canCancel ? `<button class=\"btn-secondary btn-small cancel-booking\" data-id=\"${booking.id}\" title=\"5% fee applies\">Cancel (5% fee)</button>` : '';
            })()}
          </div>
        </div>
      </div>
    `;
  }

  groupBookingsByStatus(bookings) {
    return bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  attachEventListeners() {
    const connectBtn = document.getElementById('connect-for-dashboard');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        const event = new CustomEvent('wallet-connect');
        document.dispatchEvent(event);
      });
    }

    // Handle cancellations
    document.querySelectorAll('.cancel-booking').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        if (!confirm('Cancel this booking? A 5% fee will be deducted.')) return;
        const { updateBookingStatus } = await import('../utils/storage.js');
        const { BOOKING_STATUS } = await import('../config/constants.js');
        updateBookingStatus(id, BOOKING_STATUS.CANCELLED);
        window.location.reload();
      });
    });
  }
}


