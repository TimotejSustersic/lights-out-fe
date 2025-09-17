import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-event-popup',
  standalone: true,
  templateUrl: './event-popup.component.html',
})
export class EventPopupComponent {

  open = input(false);
  moves = input(0);
  time = input<number | null>(null); // optional
  loading = input(false);

  close = output<void>();
}
