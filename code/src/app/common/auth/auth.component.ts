import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import type { BootstrapData, SuccessBootstrapData } from "../bootstrap.service";
import { FullPageErrorFallbackComponent } from "../components/full-page-error-fallback.component";
import { FullPageSpinnerComponent } from "../components/full-page-spinner.component";
import {
  type ErrorResponse,
  isErrorResponse,
  isPending,
  isSuccessResponse,
  type PendingState,
} from "../response-state/response-states";
import { type TypeGuard, TypeGuardPipe } from "../type-guard.pipe";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [
    CommonModule,
    TypeGuardPipe,
    FullPageSpinnerComponent,
    FullPageErrorFallbackComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (authService.bootstrapResponse$ | async; as bootstrapResponse) {
      @if (bootstrapResponse | typeGuard: isPending) {
        <app-full-page-spinner />
      }

      @if (bootstrapResponse | typeGuard: isErrorResponse; as errorResponse) {
        <app-full-page-error-fallback [errorMessage]="errorResponse.message" />
      }

      @if (
        bootstrapResponse | typeGuard: isSuccessResponse;
        as successResponse
      ) {
        <ng-content />
      }
    }
  `,
})
export class AuthComponent {
  protected readonly authService = inject(AuthService);

  protected readonly isPending: TypeGuard<BootstrapData, PendingState> =
    isPending;

  protected readonly isErrorResponse: TypeGuard<BootstrapData, ErrorResponse> =
    isErrorResponse;

  protected readonly isSuccessResponse: TypeGuard<
    BootstrapData,
    SuccessBootstrapData
  > = isSuccessResponse;
}