import { Component, effect, input, output, signal } from '@angular/core';
import { Solution } from '../../../schemas/solutions';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
})
export class BoardComponent {
  size = input(3);
  board = input<Array<number>>([]);

  solution = input<Solution | null>(null);
  markedCells = signal<Set<number>>(new Set());

  cellClick = output<{ index: number }>();

  constructor() {
    // If board has solution we need to add dots to squares on load
    effect(() => {
      const sol = this.solution();
      if (sol) 
        this.markedCells.set(this.loadSolutionDots(sol));
      else 
        this.markedCells.set(new Set());
    });
  }

  handleCellClick(index: number) {
    // dots work as a toggle, so even if the user presses the wrong tile, we show a dot so he will press it again.
    this.markedCells.update((set) => {
      const newSet = new Set(set);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });

    this.cellClick.emit({ index });
  }

  // consdition to show the dot on a tile (along with solution)
  ifCellNeedsAction(index: number): boolean {
    return this.markedCells().has(index);
  }

  // steps have (x,y) structure so we load them flat in a set
  private loadSolutionDots(sol: Solution) {
    return new Set(sol.steps?.map((step) => step.x * this.size() + step.y) ?? []);
  }
}
