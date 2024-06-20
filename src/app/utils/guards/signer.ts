import { inject } from "@angular/core"
import { Router } from "@angular/router";
import { SignerService } from "src/app/signer.service"

export const SignerGuard = () => {
  const signerService = inject(SignerService);
  const router = inject(Router);
  if (!signerService.signer()) {
    router.navigateByUrl('');
    return false;
  }
  return true;
}