import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import KPI from "./KPI";
import {
  createKpi,
  deleteKpi,
  subscribeKpi,
  updateKpi,
} from "../services/kpiService";

jest.mock("../hooks/useAuth", () => ({
  __esModule: true,
  default: () => ({
    user: { name: "Test Manager", role: "manager" },
  }),
}));

jest.mock("../services/kpiService", () => ({
  createKpi: jest.fn(),
  updateKpi: jest.fn(),
  getKpis: jest.fn(),
  deleteKpi: jest.fn(),
  subscribeKpi: jest.fn(),
}));

const existingKpi = {
  id: "kpi-1",
  title: "Existing KPI",
  description: "Existing description",
  target: "50",
  deadline: "2026-07-15",
  createdBy: "Test Manager",
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("submits KPI form data to the Firestore service", async () => {
  subscribeKpi.mockImplementation((callback) => {
    callback([]);
    return jest.fn();
  });
  createKpi.mockResolvedValue("new-kpi-id");

  const { container } = render(<KPI />);

  fireEvent.click(screen.getByRole("button", { name: /create kpi/i }));

  fireEvent.change(container.querySelector('input[name="title"]'), {
    target: { value: "DB Test KPI" },
  });
  fireEvent.change(container.querySelector('textarea[name="description"]'), {
    target: { value: "Created from frontend database test" },
  });
  fireEvent.change(container.querySelector('input[name="target"]'), {
    target: { value: "80" },
  });
  fireEvent.change(container.querySelector('input[name="deadline"]'), {
    target: { value: "2026-07-01" },
  });

  fireEvent.click(screen.getByRole("button", { name: /save/i }));

  await waitFor(() => {
    expect(createKpi).toHaveBeenCalledWith({
      title: "DB Test KPI",
      description: "Created from frontend database test",
      target: "80",
      deadline: "2026-07-01",
      createdBy: "Test Manager",
    });
  });
});

test("reads KPI data from the Firestore service", () => {
  subscribeKpi.mockImplementation((callback) => {
    callback([existingKpi]);
    return jest.fn();
  });

  render(<KPI />);

  expect(screen.getByText("Existing KPI")).toBeInTheDocument();
  expect(screen.getByText("Existing description")).toBeInTheDocument();
  expect(screen.getByText("Test Manager")).toBeInTheDocument();
  expect(screen.getByText("50%")).toBeInTheDocument();
  expect(screen.getByText("2026-07-15")).toBeInTheDocument();
});

test("updates KPI data through the Firestore service", async () => {
  subscribeKpi.mockImplementation((callback) => {
    callback([existingKpi]);
    return jest.fn();
  });
  updateKpi.mockResolvedValue();

  const { container } = render(<KPI />);

  fireEvent.click(screen.getByRole("button", { name: /edit/i }));

  fireEvent.change(container.querySelector('input[name="title"]'), {
    target: { value: "Updated KPI" },
  });
  fireEvent.change(container.querySelector('textarea[name="description"]'), {
    target: { value: "Updated description" },
  });
  fireEvent.change(container.querySelector('input[name="target"]'), {
    target: { value: "90" },
  });
  fireEvent.change(container.querySelector('input[name="deadline"]'), {
    target: { value: "2026-08-01" },
  });

  fireEvent.click(screen.getByRole("button", { name: /save/i }));

  await waitFor(() => {
    expect(updateKpi).toHaveBeenCalledWith("kpi-1", {
      title: "Updated KPI",
      description: "Updated description",
      target: "90",
      deadline: "2026-08-01",
      createdBy: "Test Manager",
    });
  });
});

test("deletes KPI data through the Firestore service", async () => {
  subscribeKpi.mockImplementation((callback) => {
    callback([existingKpi]);
    return jest.fn();
  });
  deleteKpi.mockResolvedValue();

  render(<KPI />);

  fireEvent.click(screen.getByRole("button", { name: /delete/i }));

  await waitFor(() => {
    expect(deleteKpi).toHaveBeenCalledWith("kpi-1");
  });
});
