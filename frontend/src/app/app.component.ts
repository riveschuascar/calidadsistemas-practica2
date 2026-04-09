import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
