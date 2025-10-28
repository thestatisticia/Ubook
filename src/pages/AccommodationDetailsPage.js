// Accommodation Details Page Component
import { SAMPLE_ACCOMMODATIONS } from '../config/constants.js';
import { connectWallet } from '../utils/wallet.js';
import { getBalance } from '../utils/wallet.js';
import { storeBooking, getUserData } from '../utils/storage.js';
import { BOOKING_STATUS } from '../config/constants.js';

export class AccommodationDetailsPage {
  constructor(currentUser, walletConnection) {
    this.currentUser = currentUser;
    this.walletConnection = walletConnection;
  }

  render(id) {
    const accommodation = SAMPLE_ACCOMMODATIONS.find(acc => acc.id === parseInt(id));
    
    if (!accommodation) {
      return '<div class="error-page"><h2>Accommodation not found</h2><a href="#/browse">Back to Browse</a></div>';
    }

    const { name, type, location, rating, images, pricePerNight, description, amenities, available, id: accId } = accommodation;
    const now = new Date();
    const currentYear = now.getFullYear();
    const years = [currentYear, currentYear + 1, currentYear + 2];
    const months = [
      { value: 0, label: 'January' }, { value: 1, label: 'February' }, { value: 2, label: 'March' },
      { value: 3, label: 'April' }, { value: 4, label: 'May' }, { value: 5, label: 'June' },
      { value: 6, label: 'July' }, { value: 7, label: 'August' }, { value: 8, label: 'September' },
      { value: 9, label: 'October' }, { value: 10, label: 'November' }, { value: 11, label: 'December' }
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const totalPrice = pricePerNight * 3; // Example: 3 nights

    return `
      <div class="accommodation-details-page">
        <div class="details-container">
          <button class="back-button" onclick="window.location.hash='#/browse'">← Back to Browse</button>
          
          <div class="details-header">
            <h1>${name}</h1>
            <p class="location-text">${location}</p>
            <div class="badges">
              <span class="type-badge">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
              <span class="rating-badge">★ ${rating}</span>
              ${available ? '<span class="available-badge">Available</span>' : '<span class="unavailable-badge">Unavailable</span>'}
            </div>
          </div>

          <div class="details-content">
            <div class="image-gallery">
              <img src="${images[0]}" alt="${name}" class="main-image">
            </div>

            <div class="booking-panel">
              <div class="price-box">
                <div class="price-main">
                  <span class="currency">${pricePerNight} CELO</span>
                  <span class="price-label">per night</span>
                </div>
                <p class="price-note">All payments secured by smart contract escrow</p>
              </div>

              ${!this.walletConnection?.connected ? `
                <div class="connect-prompt">
                  <p>Connect your wallet to book</p>
                  <button class="btn-primary" id="connect-for-booking">Connect Wallet</button>
                </div>
              ` : available ? `
                <div class="booking-form">
                  <h3>Select Your Dates</h3>
                  <div class="date-inputs">
                    <div class="date-input">
                      <label>Check-in</label>
                      <div class="date-selects">
                        <select id="checkin-day" class="date-select"><option value="">Day</option>${days.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
                        <select id="checkin-month" class="date-select"><option value="">Month</option>${months.map(m => `<option value="${m.value}">${m.label}</option>`).join('')}</select>
                        <select id="checkin-year" class="date-select"><option value="">Year</option>${years.map(y => `<option value="${y}">${y}</option>`).join('')}</select>
                      </div>
                    </div>
                    <div class="date-input">
                      <label>Check-out</label>
                      <div class="date-selects">
                        <select id="checkout-day" class="date-select"><option value="">Day</option>${days.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
                        <select id="checkout-month" class="date-select"><option value="">Month</option>${months.map(m => `<option value="${m.value}">${m.label}</option>`).join('')}</select>
                        <select id="checkout-year" class="date-select"><option value="">Year</option>${years.map(y => `<option value="${y}">${y}</option>`).join('')}</select>
                      </div>
                    </div>
                  </div>
                  <div class="summary-box" id="booking-summary" style="display: none;">
                    <div class="summary-row">
                      <span>Nights:</span>
                      <span id="nights-count">0</span>
                    </div>
                    <div class="summary-row">
                      <span>Price per night:</span>
                      <span>${pricePerNight} CELO</span>
                    </div>
                    <div class="summary-row summary-total">
                      <span>Total Amount:</span>
                      <span id="total-amount">0 CELO</span>
                    </div>
                    <div class="summary-row">
                      <span>Deposit Amount:</span>
                      <input type="number" id="deposit-amount" class="number-input" min="0" step="0.01" placeholder="Enter amount to deposit">
                    </div>
                    <div class="summary-row" id="booking-error" style="color: #b00020; display: none;"></div>
                  </div>
                  
                  <div class="wallet-balance" id="wallet-balance">
                    <span>Your Balance: Loading...</span>
                  </div>

                  <button class="btn-primary btn-large" id="deposit-button" disabled>
                    Deposit CELO & Create Booking
                  </button>
                </div>
              ` : `
                <div class="unavailable-notice">
                  <p>This accommodation is currently unavailable</p>
                </div>
              `}
            </div>

            <div class="details-info">
              <h2>About this place</h2>
              <p>${description}</p>

              <h2>Amenities</h2>
              <div class="amenities-grid">
                ${amenities.map(amenity => `
                  <div class="amenity-item">✓ ${amenity}</div>
                `).join('')}
              </div>

              <h2>Important Information</h2>
              <div class="info-box">
                <p><strong>Payment:</strong> All payments are held in an on-chain escrow smart contract until you complete your stay.</p>
                <p><strong>Booking Process:</strong> After you deposit CELO, we will book the accommodation on your behalf and guide you through the process.</p>
                <p><strong>Arrival:</strong> Our team will help you settle in when you arrive in Uganda.</p>
                <p><strong>Network:</strong> Currently using Celo Alfajores testnet for testing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners(id) {
    // Connect wallet button
    const connectBtn = document.getElementById('connect-for-booking');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        const event = new CustomEvent('wallet-connect');
        document.dispatchEvent(event);
      });
    }

    // Date calculation
    const ciDay = document.getElementById('checkin-day');
    const ciMonth = document.getElementById('checkin-month');
    const ciYear = document.getElementById('checkin-year');
    const coDay = document.getElementById('checkout-day');
    const coMonth = document.getElementById('checkout-month');
    const coYear = document.getElementById('checkout-year');
    const depositAmountInput = document.getElementById('deposit-amount');
    const depositButton = document.getElementById('deposit-button');

    const recalcAndValidate = () => {
      const accommodation = SAMPLE_ACCOMMODATIONS.find(a => a.id === parseInt(id));
      if (!accommodation) return;
      const checkin = (ciYear?.value && ciMonth?.value !== '' && ciDay?.value)
        ? new Date(parseInt(ciYear.value, 10), parseInt(ciMonth.value, 10), parseInt(ciDay.value, 10))
        : null;
      const checkout = (coYear?.value && coMonth?.value !== '' && coDay?.value)
        ? new Date(parseInt(coYear.value, 10), parseInt(coMonth.value, 10), parseInt(coDay.value, 10))
        : null;
      let nights = 0;

      const errorEl = document.getElementById('booking-error');
      if (errorEl) errorEl.style.display = 'none';

      if (checkin && checkout) {
        if (checkout > checkin) {
          nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        } else {
          if (errorEl) {
            errorEl.textContent = 'Check-out date must be after check-in date.';
            errorEl.style.display = 'block';
          }
        }
      }

      const total = nights * (accommodation.pricePerNight || 0);

      if (nights > 0) {
        document.getElementById('nights-count').textContent = nights;
        document.getElementById('total-amount').textContent = `${total} CELO`;
        document.getElementById('booking-summary').style.display = 'block';
      }

      // Validate deposit
      const depositVal = parseFloat(depositAmountInput?.value || '0');
      const validDeposit = depositVal > 0 && (total === 0 || depositVal <= total);
      depositButton.disabled = !(nights > 0 && validDeposit);
    };

    [ciDay, ciMonth, ciYear, coDay, coMonth, coYear].forEach(el => {
      if (el) el.addEventListener('change', recalcAndValidate);
    });
    if (depositAmountInput) depositAmountInput.addEventListener('input', recalcAndValidate);

    // Get wallet balance
    const loadBalance = async () => {
      if (!this.walletConnection?.address) return;
      
      const balance = await getBalance(this.walletConnection.address);
      const balanceElement = document.getElementById('wallet-balance');
      if (balanceElement) {
        balanceElement.innerHTML = `<span>Your Balance: <strong>${balance.toFixed(2)} CELO</strong></span>`;
      }
    };

    loadBalance();

    // Deposit button handler
    if (depositButton) {
      depositButton.addEventListener('click', async () => {
        const checkin = (ciYear?.value && ciMonth?.value !== '' && ciDay?.value)
          ? new Date(parseInt(ciYear.value, 10), parseInt(ciMonth.value, 10), parseInt(ciDay.value, 10))
          : null;
        const checkout = (coYear?.value && coMonth?.value !== '' && coDay?.value)
          ? new Date(parseInt(coYear.value, 10), parseInt(coMonth.value, 10), parseInt(coDay.value, 10))
          : null;
        const depositVal = parseFloat(depositAmountInput?.value || '0');

        const accommodation = SAMPLE_ACCOMMODATIONS.find(a => a.id === parseInt(id));
        let nights = 0;
        if (checkin && checkout && checkout > checkin) {
          nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        }

        if (nights <= 0) {
          alert('Please enter a valid number of nights or valid dates');
          return;
        }

        const total = nights * accommodation.pricePerNight;
        if (!(depositVal > 0 && depositVal <= total)) {
          alert('Enter a valid deposit amount (greater than 0 and not more than total)');
          return;
        }

        // Create booking object
        const booking = {
          id: Date.now(),
          accommodationId: accommodation.id,
          accommodationName: accommodation.name,
          accommodationLocation: accommodation.location,
          accommodationType: accommodation.type,
          checkIn: checkin || null,
          checkOut: checkout || null,
          nights: nights,
          pricePerNight: accommodation.pricePerNight,
          totalAmount: total,
          depositAmount: depositVal,
          status: BOOKING_STATUS.PENDING,
          dateCreated: new Date().toISOString(),
          walletAddress: this.walletConnection.address
        };

        // Store booking
        const { storeBooking } = await import('../utils/storage.js');
        storeBooking(booking);

        // Show success message
        alert(`Booking created! Booking ID: ${booking.id}\n\nDeposit ${total} CELO to complete your booking.\n\nNote: In production, this would trigger a blockchain transaction.`);

        // Navigate to dashboard
        window.location.hash = '#/dashboard';
      });
    }
  }
}


