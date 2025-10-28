// MetaMask Wallet Integration Utilities

/**
 * Connect to Celo wallet (Valora or Celo Wallet)
 * @returns {Promise<Object>} Wallet connection object
 */
export async function connectWallet() {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not detected. Please install MetaMask.');
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return {
      address: accounts[0],
      network: await getNetworkInfo(),
      connected: true
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet() {
  try {
    // Clear wallet state
    return { connected: false, address: null };
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
}

/**
 * Get current account balance
 * @param {string} address - Wallet address
 * @returns {Promise<number>} Balance in CELO
 */
export async function getBalance(address) {
  try {
    if (typeof window.ethereum === 'undefined') return 0;
    const balanceHex = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    return parseInt(balanceHex, 16) / 1e18; // ETH-like unit
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
}

/**
 * Get network information
 * @returns {Promise<Object>} Network info
 */
export async function getNetworkInfo() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      return { chainId, network: 'EVM' };
    }
    return { chainId: 0, network: 'Unknown' };
  } catch (error) {
    console.error('Error getting network info:', error);
    return { chainId: 0, network: 'Unknown' };
  }
}

/**
 * Send CELO transaction
 * @param {string} to - Recipient address
 * @param {number} amount - Amount in CELO (will be converted to wei)
 * @returns {Promise<string>} Transaction hash
 */
export async function sendTransaction(to, amount) {
  try {
    if (typeof window.ethereum === 'undefined') throw new Error('No wallet connected');
    const weiAmountHex = `0x${Math.floor(amount * 1e18).toString(16)}`;
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: await getCurrentAccount(),
        to,
        value: weiAmountHex,
        data: '0x'
      }]
    });
    return txHash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

/**
 * Get current account
 * @returns {Promise<string>} Current account address
 */
export async function getCurrentAccount() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      return accounts[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
}

/**
 * Switch to Celo network if needed
 */
export async function switchToCeloNetwork() {
  try {
    // Optional: keep function to switch chains if needed by the dapp
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_chainId' });
    }
  } catch (error) {
    console.error('Error switching network:', error);
    throw error;
  }
}


