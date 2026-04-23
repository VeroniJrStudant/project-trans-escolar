import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatCard } from "../stat-card";

describe("StatCard", () => {
  it("renderiza título, valor e dica", () => {
    render(
      <StatCard title="Teste" value="42" hint="detalhe opcional" />,
    );
    expect(screen.getByText("Teste")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("detalhe opcional")).toBeInTheDocument();
  });

  it("omite hint quando não informado", () => {
    render(<StatCard title="A" value="B" />);
    expect(screen.queryByText("detalhe")).not.toBeInTheDocument();
  });
});
