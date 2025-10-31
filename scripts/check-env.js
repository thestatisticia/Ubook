import 'dotenv/config';
import hardhat from 'hardhat';

async function main() {
  console.log('DEPLOYER_PK length:', process.env.DEPLOYER_PK ? process.env.DEPLOYER_PK.length : 0);
  const signers = await hardhat.ethers.getSigners();
  console.log('signers count:', signers.length);
  if (signers[0]) {
    console.log('first signer:', await signers[0].getAddress());
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; });



