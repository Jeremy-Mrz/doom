import { Component, inject } from '@angular/core';
import { Contract, Interface, parseUnits } from 'ethers';
import doomAbi from "../utils/abi/doom";
import { contractAddresses } from '../utils/contract/addresses';

import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SignerService } from '../signer.service';
import { initSDK } from '../utils/sdk';
import { Strategy } from '@bancor/carbon-sdk';
import { TokenNamePipe } from '../utils/pipes';
import { ToolbarComponent } from '../utilities/toolbar/toolbar.component';
import erc20 from '../utils/abi/erc20';
import { tokens } from '../utils/tokens/info';

const imports = [
  MatButtonModule,
  RouterModule,
  TokenNamePipe,
  ToolbarComponent
]

@Component({
  selector: 'app-home',
  standalone: true,
  imports,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private signerService = inject(SignerService);
  balance?: string;
  signer = this.signerService.signer;
  deployedStrategies: Strategy[] = [];
  loading = false;

  async ngOnInit() {
    if (this.signerService.signer()) await this.getStrategies();
  }

  async metamask() {
    await this.signerService.connectetSigner();
    if (!this.deployedStrategies.length) await this.getStrategies();
  }

  async getStrategies() {
    this.loading = true;
    if (!this.signerService.signer()) return;
    const doom = new Contract(contractAddresses.doomAddress, doomAbi, this.signerService.signer());
    const filters = doom.filters['StategiesIdList'];
    if (!filters) {
      this.loading = false;
      return;
    };
    const res = await doom.queryFilter(filters);
    const ids = [];
    for (const log of res) {
      if ("args" in log) {
        ids.push(...log.args[0]);
      };
    };
    const { SDK } = initSDK();
    const promises = ids.map(id => SDK.getStrategyById(id));
    const strategies = await Promise.all(promises);
    this.deployedStrategies.push(...strategies);
    this.loading = false;
  }
}