import { createPublicClient, createWalletClient, http, parseAbi, getAddress } from 'viem';
import { celoAlfajores } from 'viem/chains';
import fs from 'fs';
import 'dotenv/config';

const { address } = JSON.parse(fs.readFileSync('./src/config/ubook-address.json', 'utf8'));
const abi = JSON.parse(fs.readFileSync('./src/config/ubook-abi.json', 'utf8'));

const pk = process.env.DEPLOYER_PK;

const publicClient = createPublicClient({ chain: celoAlfajores, transport: http() });
const walletClient = createWalletClient({ chain: celoAlfajores, transport: http(), account: pk });

async function sampleRead() {
  const fee = await publicClient.readContract({ address, abi, functionName: 'platformFeeBps' });
  console.log('Platform fee (bps):', fee);
}

sampleRead().catch(console.error);






