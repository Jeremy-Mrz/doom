import { Component, Input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SignerService } from 'src/app/signer.service';
import { ActivatedRoute } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';

const imports = [
  CommonModule,
  MatIconModule,
  MatButtonModule,
  RouterModule
]

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Input() title: string = '';
  signerService = inject(SignerService);
  route = inject(ActivatedRoute);
  location = inject(Location)
  current$ = this.route.url.pipe(
    map(res => res.length ? res : false)
  );

  back() {
    this.location.back();
  }
}
