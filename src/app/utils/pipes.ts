import { Pipe, PipeTransform } from "@angular/core";
import { Tokens, tokens } from "./tokens/info";


@Pipe({ name: 'TokenName', standalone: true })
export class TokenNamePipe implements PipeTransform {
  transform(tokenAddress: string) {
    const token = tokens.find(token => token.address === tokenAddress);
    return token?.symbol ?? '???';
  }
}