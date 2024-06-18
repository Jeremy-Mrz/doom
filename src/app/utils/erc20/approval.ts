import { BigNumberish, BrowserProvider, Contract, JsonRpcSigner } from "ethers";
import erc20abi from '../abi/erc20';
import { contractAddresses } from "../contract/addresses";

const carbonController = contractAddresses.ccAddress;

export async function approveToken(token: string, amount: BigNumberish, signer: JsonRpcSigner, target: string = carbonController) {
  const contract = new Contract(token, erc20abi, signer) as any;
  const connect = contract.connect(signer);
  await connect.approve(target, amount.toString());
}