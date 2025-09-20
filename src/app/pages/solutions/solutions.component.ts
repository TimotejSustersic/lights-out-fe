import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api';
import { BoardComponent } from '../../components/board/board.component';
import { EventPopupComponent } from '../../components/event-popup/event-popup.component';
import { Problem } from '../../../schemas/problems';
import { Solution } from '../../../schemas/solutions';

@Component({
  selector: 'app-solutions',
  imports: [BoardComponent, EventPopupComponent],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.css',
})
export class SolutionsComponent {
  problems = signal<Array<Problem>>([]);
  selectedProblem = signal<Problem | null>(null);

  sizes = [3, 4, 5, 6, 7, 8];
  selectedSize = signal(3);

  board = signal<Array<number>>([]);
  solution = signal<Solution | null>(null);

  moves = signal(0);
  solvedCells = signal<Array<number>>([]);

  popup = signal({ open: false, success: true, message: '' });

  totalTime = 5 * 60; // 5 minutes to complete the puzzle
  remainingTime = signal(this.totalTime);
  private timer: any;

  constructor(private api: ApiService) {
    this.loadProblems();
  }

  // for datagrid
  loadProblems() {
    this.api.getProblems().subscribe((problems) => this.problems.set(problems));
  }

  startCountdown() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      this.remainingTime.update((time) => {
        if (time <= 0) {
          this.stopCountdown();
          this.onTimeUp();
          return 0;
        }
        return time - 1;
      });
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
    this.remainingTime.set(this.totalTime);
  }
  get formattedTime(): string {
    const m = Math.floor(this.remainingTime() / 60);
    const s = this.remainingTime() % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
  formatTimestamp(timestamp: string | Date): string {
    const date = new Date(timestamp);
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${minutes}:${seconds}`;
  }
  onTimeUp() {
    this.popup.set({ open: true, success: false, message: '⏳ Out of time! Try again?' });
  }

  selectProblem(problem: Problem) {
    this.selectedProblem.set(problem);
    this.selectedSize.set(problem.size);
    this.resetBoard();
  }
  resetBoard(): void {
    this.resetCountdown();
    this.moves.set(0);
    this.solvedCells.set([]);
    this.solution.set(null);

    const problem = this.selectedProblem();
    if (problem) this.board.set([...problem.grid]);
  }

  // cell will toggle itself and all the neighbours (if possible)
  onCellClick({ index }: { index: number }) {
    this.startCountdown();
    this.moves.update((val) => val + 1);

    const size = this.selectedSize();
    const newBoard = [...this.board()];

    const toggle = (i: number) => {
      if (i >= 0 && i < newBoard.length) newBoard[i] = newBoard[i] === 1 ? 0 : 1;
    };

    toggle(index);
    toggle(index - size);
    toggle(index + size);
    if (index % size < size - 1) toggle(index + 1);
    if (index % size > 0) toggle(index - 1);

    this.board.set(newBoard);

    // for every toggle check if the user solved the puzzle. then reset and show the pupup
    if (this.checkIfCompleted()) {
      this.popup.set({
        open: true,
        success: true,
        message: `And it only took you ${this.moves()} moves. </br> (You wasted ${
          this.moves() - (this.selectedProblem()?.moves ?? 0)
        } 😉).`,
      });
    }
  }
  checkIfCompleted(): boolean {
    return this.board().every((cell) => cell === 1);
  }

  getSolution() {
    const problem = this.selectedProblem();
    if (!problem) return;

    // TODO sometimes this endpoint takes some time, maybe a loading screen would be beneficial
    this.api.getSolutionsForProblem(problem.id).subscribe((response) => {
      this.resetBoard();
      this.solution.set(response);
    });
  }

  onPopupClose() {
    this.resetBoard();
    this.popup.set({ ...this.popup(), open: false });
  }

  ngOnDestroy() {
    this.stopCountdown();
  }
}
