import { describe, expect, it } from "vitest";
import { PRIORITY_LABELS, PRIORITY_ORDER, PRIORITY_STYLES } from "./priority";

describe("priority", () => {
  it("orders priorities from lowest to highest", () => {
    expect(PRIORITY_ORDER).toEqual(["LOW", "MEDIUM", "HIGH"]);
  });

  it("has a label and a style for every priority in the order", () => {
    for (const priority of PRIORITY_ORDER) {
      expect(PRIORITY_LABELS[priority]).toBeTruthy();
      expect(PRIORITY_STYLES[priority]).toBeTruthy();
    }
  });
});
