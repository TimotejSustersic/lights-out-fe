import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'; // correct import
import { ThemeControllerService } from './theme.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',  // usually AppComponent uses app.component.html
  styleUrls: ['./app.component.css'],
  standalone: true,                     // this is important
  imports: [RouterOutlet, RouterLink, RouterLinkActive]               // allows <router-outlet> in template
})
export class App implements OnInit {

  constructor(public theme: ThemeControllerService) {}

  ngOnInit() {
  }
}
