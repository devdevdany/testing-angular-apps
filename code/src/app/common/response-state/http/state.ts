import { HttpResponse } from "@angular/common/http";
import {
  type HandledObservableError,
  isHandledHttpError,
} from "../../error/handle-observable-error";
import { isObjectLike } from "../../is-object-like";
import type { JSONTypes } from "../../json-types";

export type HttpResponseWithNonNullBody<TResponseBody extends JSONTypes> =
  HttpResponse<TResponseBody> & {
    body: NonNullable<HttpResponse<TResponseBody>["body"]>;
  };

const IDLE_STATE = "idle";
export type HttpIdleState = { state: typeof IDLE_STATE };

const PENDING_STATE = "pending";
export type HttpPendingState = { state: typeof PENDING_STATE };

const ERROR_STATE = "error";
export type HttpErrorState = {
  state: typeof ERROR_STATE;
  error: HandledObservableError;
};

const SUCCESS_STATE = "success";
export type HttpSuccessState<TResponseBody extends JSONTypes> = {
  state: typeof SUCCESS_STATE;
  response: HttpResponseWithNonNullBody<TResponseBody>;
};

type HttpState<TResponseBody extends JSONTypes> =
  | HttpIdleState
  | HttpPendingState
  | HttpErrorState
  | HttpSuccessState<TResponseBody>;

function isHttpState<TResponseBody extends JSONTypes>(
  value: unknown,
): value is HttpState<TResponseBody> {
  const hasState = isObjectLike(value) && typeof value["state"] === "string";

  if (hasState && value["state"] === ERROR_STATE) {
    return (
      isHandledHttpError(value["error"]) || value["error"] instanceof Error
    );
  }

  if (hasState && value["state"] === SUCCESS_STATE) {
    return value["response"] instanceof HttpResponse;
  }

  return (
    hasState &&
    (value["state"] === IDLE_STATE || value["state"] === PENDING_STATE)
  );
}

export function isHttpPending(value: unknown): value is HttpPendingState {
  return isHttpState(value) && value.state === PENDING_STATE;
}

export function isHttpError(value: unknown): value is HttpErrorState {
  return isHttpState(value) && value.state === ERROR_STATE;
}

export function isHttpSuccess<TResponseBody extends JSONTypes>(
  value: unknown,
): value is HttpSuccessState<TResponseBody> {
  return isHttpState(value) && value.state === SUCCESS_STATE;
}
