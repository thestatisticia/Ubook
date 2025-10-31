// Plug Wallet & NFID Integration Utilities for ICP

/**
 * Check if Plug wallet is installed
 * @returns {boolean} True if Plug is available
 */
function isPlugInstalled() {
  return typeof window.ic !== 'undefined' && window.ic.plug;
}

/**
 * Check if NFID is available
 * @returns {boolean} True if NFID is available
 */
function isNFIDAvailable() {
  return typeof window.ic !== 'undefined' && window.ic.plug && window.ic.plug.identitykit;
}

/**
 * Connect to Plug wallet or NFID
 * @returns {Promise<Object>} Wallet connection object
 */
export async function connectWallet() {
  try {
    // Check for Plug first
    if (!isPlugInstalled()) {
      throw new Error('Plug wallet not detected. Please install Plug wallet to continue.');
    }
    
    const plug = window.ic.plug;
    
    // Request connection to Plug
    const connected = await plug.isConnected();
    if (!connected) {
      await plug.requestConnect();
    }
    
    // Get account
    const account = await plug.accountId;
    const principal = await plug.principalId;
    
    return {
      address: account,
      principal: principal,
      connected: true,
      wallet: 'plug'
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    
    // If Plug fails, try NFID if available
    if (isNFIDAvailable()) {
      try {
        const identitykit = window.ic.plug.identitykit;
        await identitykit.login();
        const principal = await window.ic.agent.getPrincipal();
        
        return {
          address: principal.toText(),
          principal: principal.toText(),
          connected: true,
          wallet: 'nfid'
        };
      } catch (nfidError) {
        console.error('NFID connection error:', nfidError);
        throw new Error('Please install Plug wallet: https://plugwallet.ooo');
      }
    }
    
    throw new Error('Please install Plug wallet: https://plugwallet.ooo');
  }
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet() {
  try {
    if (isPlugInstalled()) {
      await window.ic.plug.disconnect();
    }
    return { connected: false, address: null };
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
}

/**
 * Get current account balance (ckUSDC tokens)
 * @param {string} address - Principal ID
 * @returns {Promise<number>} Balance in ckUSDC
 */
export async function getBalance(address) {
  try {
    if (!isPlugInstalled() || !address) return 0;
    
    const plug = window.ic.plug;
    // Request ckUSDC balance instead of ICP
    const balance = await plug.requestBalance();
    
    // Convert to ckUSDC (assuming same decimals as ICP for now)
    return Number(balance) / 1e8;
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
    if (isPlugInstalled()) {
      return { network: 'ICP' };
    }
    return { network: 'Unknown' };
  } catch (error) {
    console.error('Error getting network info:', error);
    return { network: 'Unknown' };
  }
}

/**
 * Get current account
 * @returns {Promise<string>} Current account principal
 */
export async function getCurrentAccount() {
  try {
    if (isPlugInstalled()) {
      const plug = window.ic.plug;
      return await plug.principalId;
    }
    return null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
}


