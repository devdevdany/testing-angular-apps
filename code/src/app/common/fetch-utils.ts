import { getResponse } from "msw";

export async function fetchResponse(
  fetchCallback: () =>
    | ReturnType<typeof fetch>
    | ReturnType<typeof getResponse>,
) {
  try {
    return await fetchCallback();
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(`Error getting response: ${JSON.stringify(error)}`);
  }
}

export async function parseResponseBody<TResponse>(response: Response) {
  try {
    return (await response.clone().json()) as TResponse;
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(`Error parsing response body: ${JSON.stringify(error)}`);
  }
}
