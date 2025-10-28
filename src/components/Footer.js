// Footer Component
export class Footer {
  constructor(containerId) {
    this.containerId = containerId;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <footer class="app-footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <span class="footer-logo">UBOOK</span>
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link" aria-label="Twitter">Twitter</a>
            <a href="#" class="footer-link" aria-label="Telegram">Telegram</a>
            <a href="#" class="footer-link" aria-label="Discord">Discord</a>
          </div>
        </div>
      </footer>
    `;

  }
}


