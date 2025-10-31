// Navigation Bar Component
export class Navbar {
  constructor(containerId, currentUser, walletConnection) {
    this.containerId = containerId;
    this.currentUser = currentUser;
    this.walletConnection = walletConnection;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const isLoggedIn = this.currentUser && this.walletConnection && this.walletConnection.connected;
    const address = this.walletConnection?.address || '';
    const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

    container.innerHTML = `
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-brand">
            <a href="#/" class="nav-logo" aria-label="uBOOK home">
              <img src="/unnamed.jpg" alt="uBOOK" class="logo-image" />
            </a>
          </div>
          <div class="nav-links" id="nav-links">
            <a href="#/" class="nav-link">Home</a>
            <a href="#/browse" class="nav-link">Browse</a>
            <a href="#/chat" class="nav-link">Chat</a>
            ${isLoggedIn ? `
              <a href="#/dashboard" class="nav-link">My Bookings</a>
              <a href="#/admin" class="nav-link" id="admin-link" style="display:none;">Admin</a>
              <a href="#/profile" class="nav-link">Profile</a>
              <div class="nav-user">
                <span class="user-address" id="wallet-address">${displayAddress}</span>
                <button class="btn-disconnect" id="btn-disconnect">Disconnect</button>
              </div>
            ` : `
              <button class="btn-connect" id="btn-connect">Connect Wallet</button>
            `}
          </div>
        </div>
      </nav>
    `;
  }

  attachEventListeners() {
    const disconnectBtn = document.getElementById('btn-disconnect');
    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', async () => {
        const event = new CustomEvent('wallet-disconnect');
        document.dispatchEvent(event);
      });
    }

    const connectBtn = document.getElementById('btn-connect');
    if (connectBtn) {
      connectBtn.addEventListener('click', async () => {
        const event = new CustomEvent('wallet-connect');
        document.dispatchEvent(event);
      });
    }

    // Reveal admin link if whitelisted
    try {
      const wallet = JSON.parse(localStorage.getItem('walletConnection') || 'null');
      const addr = wallet?.address?.toLowerCase();
      const admin = '0xc00ae523874cdb65ed161771f28d8ec164cfb15f';
      const link = document.getElementById('admin-link');
      if (addr && addr === admin && link) link.style.display = 'inline-block';
    } catch {}
  }
}


