import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DbOfflineBanner } from "../db-offline-banner";

describe("DbOfflineBanner", () => {
  it("lista passos para subir o banco", () => {
    render(<DbOfflineBanner />);
    expect(screen.getByText(/Banco de dados inacessível/i)).toBeInTheDocument();
    expect(screen.getByText(/npm run db:up/i)).toBeInTheDocument();
    expect(screen.getAllByText(/transescolar/i).length).toBeGreaterThanOrEqual(1);
  });
});
