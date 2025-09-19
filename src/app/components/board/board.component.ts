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

  solvedCells = input<{ row: number; col: number }[]>([]);
  isCellSolved(r: number, c: number): boolean {
    return this.solvedCells().some((sc) => sc.row === r && sc.col === c);
  }
  handleCellClick(event: { row: number; col: number }) {
    this.solvedCells().push({ row: event.row, col: event.col });

     this.cellClick.emit({ row: event.row, col: event.col });
  }
}
