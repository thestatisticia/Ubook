import hardhat from 'hardhat';
const { ethers } = hardhat;
const { formatEther } = hardhat.ethers;

async function main() {
  const address = '0xd08078fe1f555a9e7f2adbddc54fc4d20063e524';
  
  try {
    const provider = new ethers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const balance = await provider.getBalance(address);
    const balanceInCELO = formatEther(balance);
    const nonce = await provider.getTransactionCount(address);
    
    console.log('Address:', address);
    console.log('Balance:', balanceInCELO, 'CELO');
    console.log('Nonce:', nonce);
    
    if (parseFloat(balanceInCELO) < 0.01) {
      console.log('\n⚠️  Low balance! Get testnet CELO at: https://faucet.celo.org/alfajores');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




