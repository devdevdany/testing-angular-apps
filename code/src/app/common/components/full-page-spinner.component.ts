import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BookSpinnerComponent } from "./book-spinner.component";

@Component({
  selector: "app-full-page-spinner",
  standalone: true,
  imports: [BookSpinnerComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      font-size: 4rem;
      height: 100vh;
      display: grid;
      place-items: center;
    }
    `,
  template: `
    <app-book-spinner />
  `,
})
export class FullPageSpinnerComponent {}
