import { Component, inject } from '@angular/core';
import { tokens } from '../../utils/tokens/info';
import { Contract, JsonRpcSigner, parseUnits } from 'ethers';
import { contractAddresses } from '../../utils/contract/addresses';
import doomAbi from "../../utils/abi/doom";
import { ConvertedStrategy, CreateStrategyParams } from '../../utils/types';

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
import { ToolbarComponent } from 'src/app/utilities/toolbar/toolbar.component';

async function checkForApproval(strategies: ConvertedStrategy[], signer: JsonRpcSigner) {
  for (const strategy of strategies) {
    if (Number(strategy.amount0) > 0) {
      const baseToken = tokens.find(token => token.address === strategy.token0);
      if (!baseToken) throw new Error("Error fetching base token data for approval");
      console.log({base: baseToken.address, amount0: strategy.amount0})
      await approveToken(strategy.token0, strategy.amount0, signer);
    }
    if (Number(strategy.amount1) > 0) {
      const quoteToken = tokens.find(token => token.address === strategy.token1);
      if (!quoteToken) throw new Error("Error fetching quote token data for approval");
      console.log({quote: quoteToken.address, amount: strategy.amount1})
      await approveToken(strategy.token1, strategy.amount1, signer);
    }
  }
}


const imports = [
  RouterModule,
  MatButtonModule,
  TokenNamePipe,
  MatIconModule,
  MatDialogModule,
  ToolbarComponent
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
    const encodedStrategies = this.strategies.map(createStrategy);
    await checkForApproval(encodedStrategies, signer);
    const strategyBundle = bundleStrategies(encodedStrategies);
    const doomContract = new Contract(contractAddresses.doomAddress, doomAbi, signer);
    // let createdIds: BigInt[] = [];
    // doomContract.on(doomContract.filters["StategiesIdList(uint256[])"], (ids) => {
    //   createdIds = [...ids];
    // });
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
