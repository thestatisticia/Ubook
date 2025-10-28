// Chat Page Component
export class ChatPage {
  constructor(currentUser, walletConnection) {
    this.currentUser = currentUser;
    this.walletConnection = walletConnection;
  }

  async render() {
    return `
      <div class="chat-page">
        <div class="chat-header glass">
          <div class="chat-title">
            <h1>Support</h1>
            <span class="chat-status">Online</span>
          </div>
          <div class="chat-actions">
            <button id="chat-clear" class="btn-secondary btn-small">Clear</button>
            <a href="#/browse" class="btn-secondary btn-small">Back to Browse</a>
          </div>
        </div>
        <div class="chat-container">
          <div id="chat-messages" class="chat-messages"></div>
          <div class="chat-input-row">
            <input id="chat-input" type="text" class="chat-input" placeholder="Type your message..." />
            <button id="chat-send" class="btn-primary">Send</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const messagesEl = document.getElementById('chat-messages');
    const inputEl = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    const fmtTime = (ts) => {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const loadMessages = () => {
      const data = localStorage.getItem('supportChat');
      const msgs = data ? JSON.parse(data) : [];
      messagesEl.innerHTML = msgs.map(m => `
        <div class="chat-message ${m.role}">
          <div class="bubble">${m.text}</div>
          <div class="meta">${fmtTime(m.ts)}</div>
        </div>
      `).join('');
      messagesEl.scrollTop = messagesEl.scrollHeight;
    };

    const pushMessage = (role, text) => {
      const data = localStorage.getItem('supportChat');
      const msgs = data ? JSON.parse(data) : [];
      msgs.push({ role, text, ts: Date.now() });
      localStorage.setItem('supportChat', JSON.stringify(msgs));
      loadMessages();
    };

    const send = () => {
      const text = (inputEl.value || '').trim();
      if (!text) return;
      pushMessage('user', text);
      inputEl.value = '';
      // Simulate agent reply
      setTimeout(() => {
        pushMessage('agent', 'Thanks! A team member will assist you shortly.');
      }, 600);
    };

    sendBtn.addEventListener('click', send);
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') send();
    });

    const clearBtn = document.getElementById('chat-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (!confirm('Clear chat history?')) return;
        localStorage.removeItem('supportChat');
        loadMessages();
      });
    }

    loadMessages();
  }
}


