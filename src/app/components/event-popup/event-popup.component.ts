import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-event-popup',
  standalone: true,
  templateUrl: './event-popup.component.html',
})
export class EventPopupComponent {
  open = input(false);
  loading = input(false);
  sucess = input<boolean>(true);

  sucessTitle = input<string>("");
  errorTitle = input<string>("");
  message = input<string>("");

  close = output<void>();
}
