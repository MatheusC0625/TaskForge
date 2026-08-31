import { describe, expect, it } from "vitest";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth";

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "Matheus",
      email: "matheus@example.com",
      password: "senha12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(
      registerSchema.safeParse({ name: "M", email: "m@example.com", password: "senha12345" })
        .success,
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      registerSchema.safeParse({ name: "Matheus", email: "not-an-email", password: "senha12345" })
        .success,
    ).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(
      registerSchema.safeParse({ name: "Matheus", email: "m@example.com", password: "1234567" })
        .success,
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("only requires a non-empty password (length is not re-validated at login)", () => {
    expect(loginSchema.safeParse({ email: "m@example.com", password: "x" }).success).toBe(true);
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "m@example.com", password: "" }).success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("rejects a malformed email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("requires both a token and a strong-enough password", () => {
    expect(
      resetPasswordSchema.safeParse({ token: "abc123", password: "senha12345" }).success,
    ).toBe(true);
  });

  it("rejects a missing token", () => {
    expect(resetPasswordSchema.safeParse({ token: "", password: "senha12345" }).success).toBe(
      false,
    );
  });
});
