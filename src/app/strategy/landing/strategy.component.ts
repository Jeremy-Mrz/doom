import { Component, inject } from '@angular/core';
import { tokens } from '../../utils/tokens/info';
import { Contract, parseUnits } from 'ethers';
import { contractAddresses } from '../../utils/contract/addresses';
import doomAbi from "../../utils/abi/doom";
import { CreateStrategyParams } from '../../utils/types';

import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { createStrategy } from '../../utils/Strategy/create';
import { SignerService } from '../../signer.service';
import { bundleStrategies } from '../../utils/Strategy/bundler';
import { TokenNamePipe } from '../../utils/pipes';
import { DialogComponent } from '../dialog/dialog.component';
import { approveToken } from 'src/app/utils/erc20/approval';


const imports = [
  RouterModule,
  MatButtonModule,
  TokenNamePipe,
  MatIconModule,
  MatDialogModule
]

@Component({
  selector: 'app-strategy',
  standalone: true,
  imports,
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.scss'
})
export class StrategyComponent {
  public signerService = inject(SignerService);
  private dialog = inject(MatDialog);
  tokens = tokens;
  loading = false;
  strategies: CreateStrategyParams[] = [];


  createStrategy() {
    const dialogRef = this.dialog.open(DialogComponent, {
      autoFocus: 'false'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.strategies.push(result);
    });
  }

  async deployStrategies() {
    const signer = this.signerService.signer();
    if (!this.strategies.length || !signer) return;
    this.loading = true;
    const promises = this.strategies.map(strategy => {
      if (Number(strategy.buyBudget) > 0 || Number(strategy.sellBudget) > 0) {
        const baseToken = tokens.find(token => token.address === strategy.baseTokenAddress);
        const quoteToken = tokens.find(token => token.address === strategy.quoteTokenAddress);
        if (!baseToken || !quoteToken) throw new Error("Error fetching token data for approval");
        const buy = parseUnits(strategy.buyBudget, baseToken.decimals);
        const sell = parseUnits(strategy.sellBudget, quoteToken.decimals);
        approveToken(strategy.baseTokenAddress, buy, signer);
        approveToken(strategy.quoteTokenAddress, sell, signer);
      }
      return createStrategy(strategy);
    });
    const encodedStrategies = await Promise.all(promises);
    const strategyBundle = bundleStrategies(encodedStrategies);
    const doomContract = new Contract(contractAddresses.doomAddress, doomAbi, signer);
    let createdIds: BigInt[] = [];
    doomContract.on(doomContract.filters["StategiesIdList(uint256[])"], (ids) => {
      createdIds = [...ids];
    });
    const tx = await doomContract['multiCallCreateStrategy'](strategyBundle);
    await tx.wait();
    this.strategies = [];
    this.loading = false;
  }

  generateStrat() {
    const mock = {
      baseTokenAddress: tokens[0].address,
      buyMin: "1",
      buyMax: "2",
      buyBudget: "0",
      quoteTokenAddress: tokens[1].address,
      sellMin: "3",
      sellMax: "4",
      sellBudget: "0"
    }
    this.strategies.push(mock);
  }

  deleteStrategy(index: number) {
    this.strategies.splice(index, 1);
  }

  updateStrategy(i: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: this.strategies[i],
      autoFocus: 'false'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.strategies.splice(i, 1, result);
    });
  }
}
