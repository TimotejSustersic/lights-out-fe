import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
})
export class BoardComponent {
  /** Input: board size */
  size = input(3);

  /** Internal board state */
  board = input<number[][]>([]);

  /** Optional solution: array of steps to show hints */
  solution = input<Solution | null>(null);

  /** Output: notify parent when a cell is clicked */
  cellClick = output<{ row: number; col: number }>();

  // /** Reset board to initial or empty */
  // resetBoard() {
  //   if (this.initialBoard().length) {
  //     this.board.set(this.initialBoard().map(row => [...row]));
  //   } else {
  //     this.board.set(Array.from({ length: this.size() }, () => Array(this.size()).fill(0)));
  //   }
  //   this.boardChange.emit(this.board());
  // }

  // /** Toggle cell + neighbors */
  // toggleCell(row: number, col: number) {
  //   const newBoard = this.board().map(r => [...r]);
  //   const toggle = (r: number, c: number) => {
  //     if (r >= 0 && r < this.size() && c >= 0 && c < this.size()) {
  //       newBoard[r][c] = newBoard[r][c] === 1 ? 0 : 1;
  //     }
  //   };
  //   toggle(row, col);
  //   toggle(row - 1, col);
  //   toggle(row + 1, col);
  //   toggle(row, col - 1);
  //   toggle(row, col + 1);

  //   this.board.set(newBoard);
  //   this.boardChange.emit(newBoard);
  // }

  // /** Returns solution step number if present */
  // getSolutionStep(row: number, col: number): number | null {
  //   if (!this.solution()) return null;
  //   const step = this.solution()!.find(s => s.x === row && s.y === col);
  //   return step ? step.order : null;
  // }
}
