import { describe, expect, it } from "vitest";
import { createTaskSchema, subtaskSchema, tagSchema, updateTaskSchema } from "./task";

describe("createTaskSchema", () => {
  it("accepts a title-only task, defaulting priority/dueDate to undefined", () => {
    const result = createTaskSchema.safeParse({ title: "Configurar CI/CD" });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ title: "Configurar CI/CD", priority: undefined, dueDate: undefined });
  });

  it("accepts a valid priority", () => {
    expect(createTaskSchema.safeParse({ title: "Tarefa", priority: "HIGH" }).success).toBe(true);
  });

  it("rejects an invalid priority", () => {
    expect(createTaskSchema.safeParse({ title: "Tarefa", priority: "URGENT" }).success).toBe(false);
  });

  it("rejects an empty title", () => {
    expect(createTaskSchema.safeParse({ title: "" }).success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("allows a partial patch with only one field", () => {
    expect(updateTaskSchema.safeParse({ priority: "LOW" }).success).toBe(true);
  });

  it("allows explicitly clearing the description with null", () => {
    expect(updateTaskSchema.safeParse({ description: null }).success).toBe(true);
  });

  it("rejects a description over 5000 characters", () => {
    expect(updateTaskSchema.safeParse({ description: "a".repeat(5001) }).success).toBe(false);
  });
});

describe("subtaskSchema", () => {
  it("rejects a title that is only whitespace", () => {
    expect(subtaskSchema.safeParse({ title: "   " }).success).toBe(false);
  });
});

describe("tagSchema", () => {
  it("accepts a valid name and hex color", () => {
    expect(tagSchema.safeParse({ name: "Backend", color: "#3b82f6" }).success).toBe(true);
  });

  it("rejects a color that is not hex", () => {
    expect(tagSchema.safeParse({ name: "Backend", color: "blue" }).success).toBe(false);
  });
});
