import { BigNumberish, BrowserProvider, Contract, JsonRpcSigner } from "ethers";
import erc20abi from '../abi/erc20';
import { contractAddresses } from "../contract/addresses";

const doomAddress = contractAddresses.doomAddress;

export async function approveToken(token: string, amount: BigNumberish, signer: JsonRpcSigner, target: string = doomAddress) {
  const contract = new Contract(token, erc20abi, signer) as any;
  const connect = contract.connect(signer);
  const tx = await connect.approve(target, BigInt(amount));
  await tx.wait();
  const allowance = await connect.allowance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", target);
  console.log({allowance})
}