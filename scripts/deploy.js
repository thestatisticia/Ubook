import hardhat from 'hardhat';
const { ethers } = hardhat;
const { formatEther } = hardhat.ethers;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddr = await deployer.getAddress();
  console.log('Deployer:', deployerAddr);
  console.log('Balance:', formatEther(await ethers.provider.getBalance(deployerAddr)), 'CELO');

  const Ubook = await ethers.getContractFactory('Ubook');
  
  console.log('Deploying contract...');
  
  // Use the regular deploy method
  const contract = await Ubook.deploy();
  
  // Get the deployment transaction
  const deploymentTx = contract.deploymentTransaction();
  if (deploymentTx) {
    console.log('Transaction hash:', deploymentTx.hash);
    console.log('Waiting for deployment...');
  }
  
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log('✅ Ubook deployed to:', address);

  // Save artifact for frontend (viem)
  const artifactPath = path.join(__dirname, '..', 'artifacts', 'src', 'contracts', 'Ubook.sol', 'Ubook.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  const configDir = path.join(__dirname, '..', 'src', 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(configDir, 'ubook-address.json'), JSON.stringify({ address }, null, 2));
  fs.writeFileSync(path.join(configDir, 'ubook-abi.json'), JSON.stringify(artifact.abi, null, 2));
  
  console.log('✅ Contract address and ABI saved to src/config/');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


