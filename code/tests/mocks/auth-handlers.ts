import { faker } from "@faker-js/faker";
import { http, HttpResponse, type PathParams } from "msw";
import type { LoginFormValues } from "../../src/app/common/auth/auth.service";
import type { User, UserWithoutPassword } from "../../src/app/common/user";
import { getStringHash } from "./get-string-hash";
import type { Rfc9457ProblemDetail } from "./rfc-9457-problem-detail";
import { mockUserDbTable } from "./user-handlers";

const SESSION_ROLLING_DURATION = 600;
const SESSION_ABSOLUTE_DURATION = 604_800;

export const mockSessionDbTable = new Map<
  string,
  {
    id: string;
    rollingExpiration: Date;
    absoluteExpiration: Date;
    userId: User["id"];
  }
>();

export const handlers = [
  http.post<PathParams, LoginFormValues>(
    "https://api.example.com/login",
    async ({ request }) => {
      const body = await request.json();
      const { username, password } = body;

      if (!username) {
        const status = 400;
        return HttpResponse.json<Rfc9457ProblemDetail>(
          {
            status,
            title: "Username is required",
          },
          { status },
        );
      }

      if (!password) {
        const status = 400;
        return HttpResponse.json<Rfc9457ProblemDetail>(
          {
            status,
            title: "Password is required",
          },
          { status },
        );
      }

      const userEntry = Array.from(mockUserDbTable.entries()).find(
        ([, { username: currentUsername }]) => currentUsername === username,
      );
      if (
        userEntry === undefined ||
        userEntry[1].passwordHash !== getStringHash(password)
      ) {
        const status = 400;
        return HttpResponse.json<Rfc9457ProblemDetail>(
          {
            status,
            title: "Invalid username or password",
          },
          { status },
        );
      }

      const [id, user] = userEntry;

      /*
       * In a real backend, use a cryptographically secure random number generator.
       * This token would be an ID pointing to the client's information stored in the database.
       * The client's information is an identifier, meaningless to prevent information disclosure attacks.
       * It must never include sensitive information or Personally Identifiable Information.
       */
      const token = faker.string.uuid();

      const rollingExpiration = new Date();
      rollingExpiration.setSeconds(
        rollingExpiration.getSeconds() + SESSION_ROLLING_DURATION,
      );

      const absoluteExpiration = new Date();
      absoluteExpiration.setSeconds(
        absoluteExpiration.getSeconds() + SESSION_ABSOLUTE_DURATION,
      );

      mockSessionDbTable.set(token, {
        id: token,
        rollingExpiration,
        absoluteExpiration,
        userId: id,
      });

      return HttpResponse.json<UserWithoutPassword>(
        {
          id,
          username: user.username,
          source: user.source,
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": `__Host-id=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_ROLLING_DURATION}`,
          },
        },
      );
    },
  ),
  http.post("https://api.example.com/logout", ({ cookies }) => {
    const sessionId = cookies["__Host-id"];
    if (sessionId === undefined) {
      const status = 401;
      return HttpResponse.json<Rfc9457ProblemDetail>(
        {
          status,
          title: "Can't log out a session that doesn't exist",
        },
        { status },
      );
    }

    mockSessionDbTable.delete(sessionId);

    return new HttpResponse(null, {
      status: 204,
      headers: { "Set-Cookie": `__Host-id=` },
    });
  }),
];