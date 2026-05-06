import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterScrollRestorationService } from './core/services/router-scroll-restoration.service';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(private readonly routerScrollRestorationService: RouterScrollRestorationService) {}
}
