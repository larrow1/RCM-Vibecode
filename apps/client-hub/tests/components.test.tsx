import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { StatsCard } from "@/components/stats-card";
import { EmptyState } from "@/components/empty-state";

describe("StatusBadge", () => {
  it("renders the status text", () => {
    render(<StatusBadge status="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies green color for Active status", () => {
    render(<StatusBadge status="Active" />);
    const badge = screen.getByText("Active");
    expect(badge.className).toContain("bg-green-100");
  });

  it("applies blue color for Prospect status", () => {
    render(<StatusBadge status="Prospect" />);
    const badge = screen.getByText("Prospect");
    expect(badge.className).toContain("bg-blue-100");
  });

  it("applies gray fallback for unknown status", () => {
    render(<StatusBadge status="Unknown" />);
    const badge = screen.getByText("Unknown");
    expect(badge.className).toContain("bg-gray-100");
  });
});

describe("TypeBadge", () => {
  it("renders human-readable label for TM", () => {
    render(<TypeBadge type="TM" />);
    expect(screen.getByText("T&M")).toBeInTheDocument();
  });

  it("renders human-readable label for FixedFee", () => {
    render(<TypeBadge type="FixedFee" />);
    expect(screen.getByText("Fixed Fee")).toBeInTheDocument();
  });
});

describe("StatsCard", () => {
  it("renders title and value", () => {
    render(<StatsCard title="Total Clients" value={42} />);
    expect(screen.getByText("Total Clients")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<StatsCard title="Pipeline" value={5} subtitle="Leads + Proposals" />);
    expect(screen.getByText("Leads + Proposals")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No clients" description="Add your first client" />);
    expect(screen.getByText("No clients")).toBeInTheDocument();
    expect(screen.getByText("Add your first client")).toBeInTheDocument();
  });

  it("renders action button when provided", () => {
    render(
      <EmptyState
        title="No clients"
        description="Add your first client"
        actionLabel="Add Client"
        actionHref="/clients/new"
      />
    );
    const link = screen.getByText("Add Client");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/clients/new");
  });
});
