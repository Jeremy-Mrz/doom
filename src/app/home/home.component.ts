import { Component } from '@angular/core';
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers';
import doomAbi from "../utils/abi/doom";
import { contractAddresses } from '../utils/addresses';

import { MatButtonModule } from '@angular/material/button';

const imports = [
  MatButtonModule
]

@Component({
  selector: 'app-home',
  standalone: true,
  imports,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  myStrategies?: any;
  balance?: string;
  signer?: JsonRpcSigner;

  async metamask() {
    const provider = new BrowserProvider((window as any).ethereum);
    this.signer = await provider.getSigner();
  }

  async test() {
    if(!this.signer) return console.log("nope");
    const doomContract = new Contract(contractAddresses.doomAddress, doomAbi, this.signer);
    const res = await doomContract['test']();
    console.log(res);
  }
}
