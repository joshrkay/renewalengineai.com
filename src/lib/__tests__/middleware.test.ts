import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

const loggedIn = { headers: { cookie: "authjs.session-token=tok" } };

function location(res: Response | undefined) {
  return res?.headers.get("location");
}

describe("middleware /login redirects", () => {
  it("sends a logged-in user on /login to the dashboard by default", () => {
    const res = middleware(
      new NextRequest("https://renewalengineai.com/login", loggedIn)
    );
    expect(location(res)).toBe("https://renewalengineai.com/dashboard");
  });

  it("honors a same-origin relative callbackUrl", () => {
    const res = middleware(
      new NextRequest(
        "https://renewalengineai.com/login?callbackUrl=%2Fcourses%2Fai-for-agent-retention%2Fmodule-1-foundation%2Flesson-1-why-retention-matters",
        loggedIn
      )
    );
    expect(location(res)).toBe(
      "https://renewalengineai.com/courses/ai-for-agent-retention/module-1-foundation/lesson-1-why-retention-matters"
    );
  });

  it("ignores an absolute callbackUrl (open-redirect guard)", () => {
    const res = middleware(
      new NextRequest(
        "https://renewalengineai.com/login?callbackUrl=https%3A%2F%2Fevil.example%2Fphish",
        loggedIn
      )
    );
    expect(location(res)).toBe("https://renewalengineai.com/dashboard");
  });

  it("ignores a backslash-prefixed callbackUrl that resolves off-origin", () => {
    // "/\evil.example" — URL parsers treat \ as /, so this resolves to
    // https://evil.example/ despite starting with a single "/".
    const res = middleware(
      new NextRequest(
        "https://renewalengineai.com/login?callbackUrl=%2F%5Cevil.example",
        loggedIn
      )
    );
    expect(location(res)).toBe("https://renewalengineai.com/dashboard");
  });

  it("ignores a protocol-relative callbackUrl (open-redirect guard)", () => {
    const res = middleware(
      new NextRequest(
        "https://renewalengineai.com/login?callbackUrl=%2F%2Fevil.example",
        loggedIn
      )
    );
    expect(location(res)).toBe("https://renewalengineai.com/dashboard");
  });

  it("redirects a logged-out dashboard visit to /login", () => {
    const res = middleware(
      new NextRequest("https://renewalengineai.com/dashboard/renewals")
    );
    expect(location(res)).toBe("https://renewalengineai.com/login");
  });

  it("lets a logged-out user reach /login", () => {
    const res = middleware(
      new NextRequest("https://renewalengineai.com/login")
    );
    expect(location(res)).toBeNull();
  });
});
