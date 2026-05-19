import { describe, it, expect } from "vitest";
import { listReports } from "../lib/storage";

describe("storage", () => {
  it("returns array (empty or seeded)", () => {
    expect(Array.isArray(listReports())).toBe(true);
  });
});
