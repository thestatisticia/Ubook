import 'dotenv/config';
import '@nomicfoundation/hardhat-toolbox';

const PRIVATE_KEY = process.env.DEPLOYER_PK || '';

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: '0.8.20',
    settings: { 
      optimizer: { enabled: true, runs: 200 },
      viaIR: true
    }
  },
  paths: {
    sources: './src/contracts',
    cache: './cache',
    artifacts: './artifacts'
  },
  networks: {
    alfajores: {
      url: 'https://alfajores-forno.celo-testnet.org',
      chainId: 44787,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      timeout: 60000
    }
  },
  mocha: {
    timeout: 40000
  }
};

export default config;


