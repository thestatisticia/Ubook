// Home Page Component
import { SAMPLE_ACCOMMODATIONS } from '../config/constants.js';
import { AccommodationCard } from '../components/AccommodationCard.js';

export class HomePage {
  constructor(currentUser, walletConnection) {
    this.currentUser = currentUser;
    this.walletConnection = walletConnection;
  }

  async render() {
    // Get featured accommodations (first 3)
    const { getAllAccommodations } = await import('../utils/storage.js');
    const dataset = getAllAccommodations().length ? getAllAccommodations() : SAMPLE_ACCOMMODATIONS;
    const featuredAccommodations = dataset.slice(0, 3);

    return `
      <div class="home-page">
        <section class="hero">
          <div class="hero-content">
            <p class="hero-subtitle">uBOOK</p>
            <h1 class="hero-title">Find a place. Book in seconds.</h1>
            <p class="hero-description">A smoother way to reserve trusted stays with escrow-backed security.</p>
            <div class="hero-buttons">
              <a href="#/browse" class="btn-primary">Browse stays</a>
              ${!this.walletConnection?.connected ? `
                <button class="btn-secondary" id="connect-wallet-hero">Connect Wallet</button>
              ` : `
                <a href="#/dashboard" class="btn-secondary">My bookings</a>
              `}
            </div>
          </div>
        </section>

        <section class="featured-section">
          <h2 class="section-title">Featured Accommodations</h2>
          <div class="accommodations-grid" id="featured-accommodations">
            ${featuredAccommodations.map(acc => {
              const card = new AccommodationCard(acc);
              return card.render();
            }).join('')}
          </div>
          <div class="section-footer"></div>
        </section>

        <section class="features">
          <div class="glass-panel">
            <h2 class="section-title">WHY UBOOK?</h2>
            <p class="panel-subtitle">Book once, enjoy peace of mind. Secure, fast, and transparent reservations backed by escrow.</p>
            <div class="feature-list">
              <div class="feature-item">
                <div class="icon-circle">🔗</div>
                <div class="item-text">
                  <h3>ESCROW SECURITY</h3>
                  <p>Deposits are held safely in escrow and released only after your stay.</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="icon-circle">⚡</div>
                <div class="item-text">
                  <h3>INSTANT CONFIRM</h3>
                  <p>Frictionless booking flow with immediate confirmation.</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="icon-circle">🛎️</div>
                <div class="item-text">
                  <h3>DEDICATED SUPPORT</h3>
                  <p>Chat directly with our team whenever you need help.</p>
                </div>
              </div>
            </div>
            <div class="panel-cta">
              <a href="#/chat" class="btn-secondary">Chat with support</a>
            </div>
          </div>
        </section>

        <section class="how-it-works">
          <div class="glass-panel">
            <h2 class="section-title">HOW IT WORKS</h2>
            <div class="feature-list">
              <div class="feature-item">
                <div class="icon-circle">🔌</div>
                <div class="item-text">
                  <h3>CONNECT WALLET</h3>
                  <p>Connect your Plug wallet to view balance and book securely.</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="icon-circle">📅</div>
                <div class="item-text">
                  <h3>SELECT DATES</h3>
                  <p>Pick check‑in and check‑out. We auto‑calculate nights and total.</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="icon-circle">🔒</div>
                <div class="item-text">
                  <h3>DEPOSIT IN ESCROW</h3>
                  <p>Funds stay locked until your stay completes or you cancel.</p>
                </div>
              </div>
            </div>
            <div class="panel-cta">
              <a href="#/browse" class="btn-primary">Explore stays</a>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  attachEventListeners() {
    // Listen for accommodation card clicks
    document.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        window.location.hash = `#/accommodation/${id}`;
      });
    });

    // Listen for hero connect wallet button
    const connectBtn = document.getElementById('connect-wallet-hero');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        const event = new CustomEvent('wallet-connect');
        document.dispatchEvent(event);
      });
    }
  }
}

