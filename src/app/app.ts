import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api';
import { RouterOutlet } from '@angular/router'; // correct import


@Component({
  selector: 'app-root',
  templateUrl: './app.html',  // usually AppComponent uses app.component.html
  styleUrls: ['./app.css'],
  standalone: true,                     // this is important
  imports: [RouterOutlet]               // allows <router-outlet> in template
})
export class App implements OnInit {
  message = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getHello().subscribe({
      next: (res) => this.message = res.message,
      error: (err) => this.message = 'Backend not available'
    });
  }
}
