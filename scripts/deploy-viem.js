import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoAlfajores } from 'viem/chains';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const privateKey = process.env.DEPLOYER_PK;
  if (!privateKey) throw new Error('DEPLOYER_PK not found in .env file');

  console.log('📦 Deploying Ubook contract to Celo Alfajores...');

  const account = privateKeyToAccount(`0x${privateKey}`);
  console.log('Deployer address:', account.address);

  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http('https://alfajores-forno.celo-testnet.org')
  });

  const walletClient = createWalletClient({
    account,
    chain: celoAlfajores,
    transport: http('https://alfajores-forno.celo-testnet.org')
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log('Balance:', Number(balance) / 1e18, 'CELO');

  // Nonce status
  const latestNonce = await publicClient.getTransactionCount({ address: account.address, blockTag: 'latest' });
  const pendingNonce = await publicClient.getTransactionCount({ address: account.address, blockTag: 'pending' });
  console.log('Nonces -> latest:', latestNonce, 'pending:', pendingNonce);

  // If a pending tx exists for nonce = latestNonce, cancel it by replacing with a 0-value self-tx
  if (pendingNonce > latestNonce) {
    console.log('\n⚠️ Pending transaction detected. Sending cancel (self) tx to free nonce', latestNonce);
    const fees = await publicClient.estimateFeesPerGas();
    const maxFeePerGas = (fees.maxFeePerGas || fees.gasPrice || 0n) * 2n;
    const maxPriorityFeePerGas = (fees.maxPriorityFeePerGas || 1000000000n) * 2n;

    const cancelHash = await walletClient.sendTransaction({
      account,
      to: account.address,
      value: 0n,
      nonce: latestNonce,
      maxFeePerGas,
      maxPriorityFeePerGas
    });
    console.log('Cancel tx hash:', cancelHash);
    console.log('Waiting for cancel confirmation...');
    await publicClient.waitForTransactionReceipt({ hash: cancelHash, confirmations: 1 });
    console.log('✅ Cancelled pending tx for nonce', latestNonce);
  }

  // Read artifact
  const artifactPath = path.join(__dirname, '..', 'artifacts', 'src', 'contracts', 'Ubook.sol', 'Ubook.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  console.log('\n📄 Deploying contract...');

  // Fresh fees to avoid replacement errors
  const fees = await publicClient.estimateFeesPerGas();
  const maxFeePerGas = (fees.maxFeePerGas || fees.gasPrice || 0n) * 2n;
  const maxPriorityFeePerGas = (fees.maxPriorityFeePerGas || 1000000000n) * 2n;

  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    account,
    args: [],
    maxFeePerGas,
    maxPriorityFeePerGas
  });

  console.log('Transaction hash:', hash);
  console.log('⏳ Waiting for confirmation...');

  const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });

  console.log('\n✅ Contract deployed successfully!');
  console.log('Contract address:', receipt.contractAddress);
  console.log('Block number:', receipt.blockNumber);
  console.log('Gas used:', receipt.gasUsed.toString());

  const configDir = path.join(__dirname, '..', 'src', 'config');
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

  fs.writeFileSync(path.join(configDir, 'ubook-address.json'), JSON.stringify({ address: receipt.contractAddress }, null, 2));
  fs.writeFileSync(path.join(configDir, 'ubook-abi.json'), JSON.stringify(artifact.abi, null, 2));

  console.log('\n✅ Contract address and ABI saved to src/config/');
  console.log('Explorer: https://alfajores.celoscan.io/address/' + receipt.contractAddress);
}

main().catch((error) => {
  console.error('\n❌ Deployment failed:', error.message);
  console.error(error);
  process.exitCode = 1;
});

