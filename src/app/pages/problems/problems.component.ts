import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api';
import { BoardComponent } from '../../components/board/board.component';
import { EventPopupComponent } from '../../components/event-popup/event-popup.component';

@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [BoardComponent, EventPopupComponent],
  templateUrl: './problems.component.html',
})
export class ProblemsComponent {
  sizes = [3, 4, 5, 6, 7, 8];
  selectedSize = signal(3);

  board = signal<number[][]>(this.getEmptyBoard(3));

  // message for feedback
  popupOpen = signal(false);
  loading = signal(false);
  success = signal(true);

  constructor(private api: ApiService) {}

  /** make empty board */
  getEmptyBoard(size: number): number[][] {
    return Array.from({ length: size }, () => Array(size).fill(0));
  }

  resetBoard(): void {
    this.board.set(this.getEmptyBoard(this.selectedSize()));
  }

  /** on size change */
  onSizeChange(event: Event) {
    const size = Number((event.target as HTMLSelectElement).value) ?? 3;
    this.selectedSize.set(size);
    this.resetBoard();
  }

  /** toggle cell (only itself) */
  onCellClick(pos: { row: number; col: number }) {
    const { row, col } = pos;
    const newBoard = this.board().map((r) => [...r]);
    newBoard[row][col] = newBoard[row][col] === 1 ? 0 : 1;
    this.board.set(newBoard);
  }

  /** Evaluate button: sends current board to backend */
  evaluateBoard() {
    this.loading.set(true);
    this.popupOpen.set(true);

    const problem: Problem = {
      id: 0,
      size: this.selectedSize(),
      grid: this.board(),
    };

    this.api.createProblem(problem).subscribe({
      next: (result) => {
        this.loading.set(false);
      },
      error: () => {
        this.success.set(false);
        this.loading.set(false);
      },
    });
  }

  onPopupClose() {
    this.resetBoard();
    this.popupOpen.set(false);
    this.loading.set(false);
  }
}
