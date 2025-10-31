import hardhat from 'hardhat';
const { ethers } = hardhat;

async function main() {
  const address = '0xd08078fe1f555a9e7f2adbddc54fc4d20063e524';
  const provider = new ethers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
  
  try {
    const latestBlock = await provider.getBlockNumber();
    console.log('Latest block:', latestBlock);
    
    // Check last 100 blocks for transactions from this address
    for (let i = 0; i < 10; i++) {
      const block = await provider.getBlock(latestBlock - i, true);
      if (block && block.transactions) {
        for (const tx of block.transactions) {
          if (tx.from && tx.from.toLowerCase() === address.toLowerCase()) {
            const receipt = await provider.getTransactionReceipt(tx.hash);
            console.log(`\nTransaction found in block ${latestBlock - i}:`);
            console.log('Hash:', tx.hash);
            console.log('To:', tx.to);
            console.log('Status:', receipt.status === 1 ? 'Success' : 'Failed');
            console.log('Gas used:', receipt.gasUsed.toString());
          }
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




