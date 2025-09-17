import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api';
import { BoardComponent } from '../../components/board/board.component';
import { EventPopupComponent } from '../../components/event-popup/event-popup.component';

@Component({
  selector: 'app-solutions',
  imports: [BoardComponent, EventPopupComponent],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.css',
})
export class SolutionsComponent {
  problems = signal<Problem[]>([]);
  selectedProblem = signal<Problem | null>(null);
  sizes = [3, 4, 5, 6, 7, 8];
  selectedSize = signal(3);

  board = signal<number[][]>([]);

  solution = signal<Solution | null>(null);

  // message for feedback
  popupOpen = signal(false);

  moves = signal(0);

  constructor(private api: ApiService) {
    this.loadProblems();
  }

  /** load all problems */
  loadProblems() {
    this.api.getProblems().subscribe((problems) => this.problems.set(problems));
  }
  /** when user selects a problem */
  selectProblem(problem: Problem) {
    this.selectedProblem.set(problem);
    this.selectedSize.set(problem.size);
    this.board.set(problem.grid.map((r) => [...r]));
    this.solution.set(null);
  }

  resetBoard(): void {
    const problem = this.selectedProblem();
    if (problem) {
      this.board.set(problem.grid.map((r) => [...r]));
    }
  }

  /** toggle cell (only itself) */
  onCellClick(pos: { row: number; col: number }) {
    this.moves.update((value) => value + 1);
    const { row, col } = pos;
    const newBoard = this.board().map((r) => [...r]);
    const size = newBoard.length;

    const toggle = (r: number, c: number) => {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        newBoard[r][c] = newBoard[r][c] === 1 ? 0 : 1;
      }
    };
    toggle(row, col);
    toggle(row - 1, col);
    toggle(row + 1, col);
    toggle(row, col - 1);
    toggle(row, col + 1);

    this.board.set(newBoard);

    if (this.checkIfCompleted()) {
      this.popupOpen.set(true);
    }
  }

  checkIfCompleted(): boolean {
    const b = this.board(); // get current board matrix
    return b.every(row => row.every(cell => cell === 1));
  }

  /** fetch solutions from backend */
  getSolution() {
    const problem = this.selectedProblem();
    if (!problem) return;
    this.api.getSolutionsForProblem(problem.id).subscribe((s) => this.solution.set(s));
  }

  onPopupClose() {
    this.resetBoard();
    this.popupOpen.set(false);
  }
}
