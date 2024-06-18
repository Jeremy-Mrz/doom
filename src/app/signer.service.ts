import { Injectable, WritableSignal, signal } from '@angular/core';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class SignerService {
  signer: WritableSignal<JsonRpcSigner | undefined> = signal(undefined);

  async connectetSigner() {
    if(this.signer()) return;
    const provider = new BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    this.signer.set(signer);
  }
}
