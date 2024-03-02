import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  type Type,
} from "@angular/core";
import { AuthComponent } from "./common/auth/auth.component";
import { AuthService } from "./common/auth/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AuthComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth>
      <ng-container *ngComponentOutlet="componentClass()"></ng-container>
    </app-auth>
  `,
})
export class AppComponent {
  readonly #authService = inject(AuthService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected componentClass = signal<null | Type<any>>(null);

  constructor() {
    effect(async () => {
      if (this.#authService.user() === null) {
        const module = await import("./unauthenticated-app.component");
        this.componentClass.set(module.UnauthenticatedAppComponent);
      } else {
        const module = await import("./authenticated-app.component");
        this.componentClass.set(module.AuthenticatedAppComponent);
      }
    });
  }
}
