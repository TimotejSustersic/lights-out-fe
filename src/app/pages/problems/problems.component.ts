import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api';
import { BoardComponent } from '../../components/board/board.component';
import { EventPopupComponent } from '../../components/event-popup/event-popup.component';
import { CreateProblemResultDTO } from '../../../schemas/problems';

@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [BoardComponent, EventPopupComponent],
  templateUrl: './problems.component.html',
})
export class ProblemsComponent {
  sizes = [3, 4, 5, 6, 7, 8];
  selectedSize = signal(3);

  board = signal<Array<number>>(this.getEmptyBoard(3));
  popup = signal({ open: false, success: true, message: '', loading: false });

  constructor(private api: ApiService) {}

  getEmptyBoard(size: number): Array<number> {
    return Array(size * size).fill(0);
  }
  resetBoard(size: number): void {
    this.board.set(this.getEmptyBoard(size));
  }
  // main action for evaluation
  evaluateBoard() {
    // show popup with loading
    this.popup.set({ ...this.popup(), open: true, loading: true });

    const problem: any = {
      id: 0,
      difficulty: 0,
      size: this.selectedSize(),
      grid: this.board(),
    };

    // the response will be successful, no matter if the problem has a solution. 
    this.api.createProblem(problem).subscribe({
      next: (response: CreateProblemResultDTO) => {
        this.popup.set({
          open: true,
          loading: false,
          success: response.success,
          message: response.success
            ? `There is a solution.<br/>I made ${response.moves} moves and it took me ${response.timeMs}ms.`
            : `There is no solution found. It took me ${response.timeMs}ms.`,
        });
      },
      error: () => {
        this.popup.set({
          ...this.popup(),
          loading: false,
          success: false,
          message: `There is no solution found.`,
        });
      },
    });
  }

  // we need to reset the whole page after size change
  onSizeChange(event: Event) {
    const size = Number((event.target as HTMLSelectElement).value) ?? 3;
    this.selectedSize.set(size);
    this.resetBoard(size);
  }
  // here only the cell pressed is affected
  onCellClick(pos: { index: number }) {
    const newBoard = [...this.board()];
    newBoard[pos.index] = newBoard[pos.index] === 1 ? 0 : 1;
    this.board.set(newBoard);
  }
  onPopupClose() {
    this.resetBoard(this.selectedSize());
    this.popup.set({ ...this.popup(), open: false, loading: false });
  }
}
