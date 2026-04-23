import { describe, expect, it } from "vitest";
import { formatBrl, formatDate, formatKm } from "../format";

describe("formatBrl", () => {
  it("formata em Real brasileiro", () => {
    expect(formatBrl(1234.5)).toMatch(/1\.234,50/);
  });
});

describe("formatKm", () => {
  it("inclui unidade", () => {
    expect(formatKm(10000)).toContain("km");
    expect(formatKm(10000)).toMatch(/10/);
  });
});

describe("formatDate", () => {
  it("aceita ISO date", () => {
    const s = formatDate("2026-04-22");
    expect(s.length).toBeGreaterThan(4);
  });
});
