import { Component, computed, signal } from '@angular/core';
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

  moves = signal(0);
  solvedCells = signal([]);

  popupOpen = signal(false);
  popupSuccess = signal(true);
  popupMessage = signal('');

  totalTime = 5 * 60; // 5 minutes
  remainingTime = this.totalTime;
  private timer: any;

  constructor(private api: ApiService) {
    this.loadProblems();
  }

  loadProblems() {
    this.api.getProblems().subscribe((problems) => this.problems.set(problems));
  }

  startCountdown() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.stopCountdown();
        this.onTimeUp();
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetCountdown() {
    this.stopCountdown();
    this.remainingTime = this.totalTime;
  }

  get spentTime(): string {
    return String(this.totalTime - this.remainingTime);
  }

  onTimeUp() {
    this.popupMessage.set('⏳ Out of time! Want another shot?');
    this.popupOpen.set(true);
    this.popupSuccess.set(false);
  }

  get formattedTime(): string {
    const m = Math.floor(this.remainingTime / 60);
    const s = this.remainingTime % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  formatTimestamp(timestamp: string | Date): string {
    const date = new Date(timestamp);
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${minutes}:${seconds}`;
  }

  getDifficultyLabel(diff: number): { label: string; color: string } {
    if (diff < 0.3) return { label: 'Easy', color: 'bg-green-400' };
    if (diff < 0.7) return { label: 'Medium', color: 'bg-yellow-400' };
    return { label: 'Hard', color: 'bg-red-500' };
  }

  selectProblem(problem: Problem) {
    this.selectedProblem.set(problem);
    this.selectedSize.set(problem.grid[0].length);
    this.board.set(problem.grid.map((r) => [...r]));
    this.solution.set(null);
    this.resetCountdown();
  }

  resetBoard(): void {
    this.resetCountdown();
    this.moves.set(0);
    this.solvedCells.set([]);
    this.solution.set(null);
    const problem = this.selectedProblem();
    if (problem) {
      this.board.set(problem.grid.map((r) => [...r]));
    }
  }

  onCellClick(pos: { row: number; col: number }) {
    this.startCountdown();
    this.moves.update((value) => value + 1);
    const { row, col } = pos;
    const newBoard = this.board().map((r) => [...r]);
    const size = newBoard.length;

    const toggle = (i: number, j: number) => {
      if (i >= 0 && i < size && j >= 0 && j < size) {
        newBoard[i][j] = newBoard[i][j] === 1 ? 0 : 1;
      }
    };

    toggle(row, col);
    toggle(row - 1, col);
    toggle(row + 1, col);
    toggle(row, col - 1);
    toggle(row, col + 1);

    this.board.set(newBoard);

    if (this.checkIfCompleted()) {
      this.popupMessage.set('And it only took you ' + this.moves() + ' moves.');
      this.popupSuccess.set(true);
      this.popupOpen.set(true);
    }
  }

  checkIfCompleted(): boolean {
    const b = this.board(); // get current board matrix
    return b.every((row) => row.every((cell) => cell === 1));
  }

  getSolution() {
    this.resetBoard();
    const problem = this.selectedProblem();
    if (!problem) return;
    this.api.getSolutionsForProblem(problem.id).subscribe((s) => this.solution.set(s));
    this.resetCountdown();
  }

  onPopupClose() {
    this.resetBoard();
    this.popupOpen.set(false);
  }

  ngOnDestroy() {
    this.stopCountdown();
  }
}
