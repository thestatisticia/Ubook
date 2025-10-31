// Main Application Entry Point
import './style.css';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { BrowsePage } from './pages/BrowsePage.js';
import { AccommodationDetailsPage } from './pages/AccommodationDetailsPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ChatPage } from './pages/ChatPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminPage } from './pages/AdminPage.js';
import { connectWallet, getBalance } from './utils/wallet.js';
import { storeWalletConnection, getWalletConnection, storeUserData, getUserData } from './utils/storage.js';

class App {
  constructor() {
    this.currentPage = null;
    this.currentUser = getUserData();
    this.walletConnection = getWalletConnection();
  }

  async init() {
    // Listen for wallet events
    document.addEventListener('wallet-connect', this.handleWalletConnect.bind(this));
    document.addEventListener('wallet-disconnect', this.handleWalletDisconnect.bind(this));

    // Listen for hash changes (routing)
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Initial render
    await this.render();
    this.handleRoute();
  }

  async handleWalletConnect() {
    try {
      const walletData = await connectWallet();
      this.walletConnection = walletData;
      
      // Update local storage
      storeWalletConnection(walletData);
      
      // Get user balance
      const balance = await getBalance(walletData.address);
      
      // Store user data
      const userData = {
        address: walletData.address,
        balance: balance,
        connected: true
      };
      
      storeUserData(userData);
      this.currentUser = userData;
      
      // Re-render
      await this.render();
      this.handleRoute();
      
      // Update navbar
      document.dispatchEvent(new CustomEvent('navbar-update'));
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet: ' + error.message);
    }
  }

  async handleWalletDisconnect() {
    this.walletConnection = null;
    this.currentUser = null;
    storeWalletConnection(null);
    storeUserData(null);
    
    await this.render();
    this.handleRoute();
    
    document.dispatchEvent(new CustomEvent('navbar-update'));
  }

  async render() {
    const container = document.getElementById('app');
    if (!container) return;

    // Render navbar
    const navbar = new Navbar('navbar', this.currentUser, this.walletConnection);
    navbar.render();
    navbar.attachEventListeners();

    // Render navbar container
    container.innerHTML = `
      <div id="navbar"></div>
      <div id="content"></div>
      <div id="footer"></div>
    `;

    // Re-render navbar
    const navbarContainer = document.getElementById('navbar');
    const navbarInstance = new Navbar('navbar', this.currentUser, this.walletConnection);
    navbarInstance.render();
    navbarInstance.attachEventListeners();

    // Render footer
    const footer = new Footer('footer');
    footer.render();
  }

  handleRoute() {
    const contentContainer = document.getElementById('content');
    if (!contentContainer) return;

    const hash = window.location.hash || '#/';
    const [_, route, ...params] = hash.split('/');
    const pageId = params[0];

    let pageInstance;

    switch (route) {
      case '':
      case 'home':
        pageInstance = new HomePage(this.currentUser, this.walletConnection);
        break;
      
      case 'browse':
        pageInstance = new BrowsePage(this.currentUser, this.walletConnection);
        break;
      
      case 'accommodation':
        pageInstance = new AccommodationDetailsPage(this.currentUser, this.walletConnection);
        break;
      
      case 'dashboard':
        pageInstance = new DashboardPage(this.currentUser, this.walletConnection);
        break;
      
      case 'chat':
        pageInstance = new ChatPage(this.currentUser, this.walletConnection);
        break;

      case 'profile':
        pageInstance = new ProfilePage(this.currentUser, this.walletConnection);
        break;
      
      case 'admin':
        pageInstance = new AdminPage(this.currentUser, this.walletConnection);
        break;
      
      default:
        contentContainer.innerHTML = '<div class="error-page"><h2>Page not found</h2><a href="#/">Go Home</a></div>';
        return;
    }

    // Render page (supports sync or async render())
    Promise.resolve(pageInstance.render(pageId)).then(html => {
      contentContainer.innerHTML = html;
      if (typeof pageInstance.attachEventListeners === 'function') {
        pageInstance.attachEventListeners(pageId);
      }
    });
  }
}

// Initialize app when DOM is ready
const app = new App();
app.init();
