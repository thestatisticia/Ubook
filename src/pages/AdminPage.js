// Admin Page - whitelist protected
import { getWalletConnection } from '../utils/storage.js';
import { getAllAccommodations, upsertAccommodation, removeAccommodation } from '../utils/storage.js';
import { SAMPLE_ACCOMMODATIONS } from '../config/constants.js';

const ADMIN_ADDRESS = '0xc00ae523874cdb65ed161771f28d8ec164cfb15f'.toLowerCase();

export class AdminPage {
  constructor(currentUser, walletConnection) {
    this.currentUser = currentUser;
    this.walletConnection = walletConnection;
  }

  async render() {
    // gate access
    const addr = this.walletConnection?.address?.toLowerCase();
    if (!addr || addr !== ADMIN_ADDRESS) {
      return `
        <div class="auth-required">
          <h2>Admin Access Required</h2>
          <p>This page is only available to whitelisted administrators.</p>
          <button class="btn-primary" id="connect-for-admin">Connect Wallet</button>
        </div>
      `;
    }

    // load dynamic list merged with defaults (for first-time use)
    const saved = getAllAccommodations();
    const all = saved.length ? saved : SAMPLE_ACCOMMODATIONS;

    return `
      <div class="admin-page">
        <div class="page-header">
          <h1>Admin Dashboard</h1>
          <p>Add or remove hotels, homestays, and restaurants</p>
        </div>

        <div class="admin-grid">
          <form id="acc-form" class="admin-form glass-panel">
            <h2 class="section-title">New Listing</h2>
            <div class="form-grid">
              <input class="form-input" id="name" placeholder="Name" required />
              <select class="form-input" id="type" required>
                <option value="">Type</option>
                <option value="hotel">Hotel</option>
                <option value="homestay">Homestay</option>
                <option value="restaurant-hotel">Restaurant</option>
              </select>
              <input class="form-input" id="location" placeholder="Location (City, Region)" required />
              <input class="form-input" id="price" placeholder="Price per night (ckUSDC)" type="number" min="0" step="0.01" required />
              <input class="form-input" id="rating" placeholder="Rating (0-5)" type="number" min="0" max="5" step="0.1" required />
              <input class="form-input" id="image" placeholder="Image URL" />
              <textarea class="form-input col-span-2" id="description" placeholder="Description" rows="3"></textarea>
              <input class="form-input col-span-2" id="amenities" placeholder="Amenities (comma separated)" />
              <label class="switch">
                <input type="checkbox" id="available" checked />
                <span>Available</span>
              </label>
            </div>
            <div class="panel-cta">
              <button type="submit" class="btn-primary">Add Listing</button>
            </div>
          </form>

          <div class="admin-list glass-panel">
            <h2 class="section-title">Current Listings</h2>
            <div id="listings" class="listings"></div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const connectBtn = document.getElementById('connect-for-admin');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('wallet-connect'));
      });
      return; // not authorized yet
    }

    const renderListings = () => {
      const container = document.getElementById('listings');
      if (!container) return;
      const data = getAllAccommodations();
      container.innerHTML = data.map(a => `
        <div class="listing-row" data-id="${a.id}">
          <div class="row-main">
            <img src="${(a.images && a.images[0]) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}" alt="${a.name}" />
            <div>
              <h3>${a.name}</h3>
              <p>${a.type} • ${a.location} • ${a.pricePerNight} ckUSDC/night • ★ ${a.rating}</p>
            </div>
          </div>
          <div class="row-actions">
            <button class="btn-secondary btn-small remove" data-id="${a.id}">Remove</button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          if (!confirm('Remove this listing?')) return;
          removeAccommodation(id);
          renderListings();
        });
      });
    };

    const form = document.getElementById('acc-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = Date.now();
        const name = document.getElementById('name').value.trim();
        const type = document.getElementById('type').value;
        const location = document.getElementById('location').value.trim();
        const pricePerNight = parseFloat(document.getElementById('price').value || '0');
        const rating = parseFloat(document.getElementById('rating').value || '0');
        const image = document.getElementById('image').value.trim();
        const description = document.getElementById('description').value.trim();
        const amenities = (document.getElementById('amenities').value || '').split(',').map(s => s.trim()).filter(Boolean);
        const available = document.getElementById('available').checked;

        const acc = {
          id,
          name,
          type,
          location,
          rating: isNaN(rating) ? 0 : rating,
          images: [image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
          pricePerNight: isNaN(pricePerNight) ? 0 : pricePerNight,
          currency: 'ckUSDC',
          description,
          amenities,
          available
        };
        upsertAccommodation(acc);
        form.reset();
        renderListings();
        alert('Listing added');
      });
    }

    renderListings();
  }
}


