import { test, expect } from "bun:test";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import App from "./App";

test("Add task", async () => {
  render(<App />);
  const input = screen.getByPlaceholderText("Новая задача");
  const button = screen.getByText("Добавить");
  expect(input).toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(screen.getByRole("list").children.length).toEqual(0);
  const taskName = "Test task";
  await userEvent.type(input, taskName);
  expect(input).toHaveValue(taskName);
  expect(screen.queryByText("Активных задач: 0")).toBeInTheDocument();
  expect(screen.queryByText("Активных задач: 1")).not.toBeInTheDocument();
  await userEvent.click(button);
  expect(screen.queryByText("Активных задач: 1")).toBeInTheDocument();
  expect(screen.queryByText("Активных задач: 0")).not.toBeInTheDocument();
  expect(input).toHaveValue("");
  expect(screen.getByText(taskName)).toBeInTheDocument();
  expect(screen.getByRole("list").children.length).toEqual(1);
});

test("Toggle task", async () => {
  render(<App />);
  const checkbox = screen.getByRole("checkbox");
  await userEvent.click(screen.getByText("Все"));
  expect(checkbox).toBeInTheDocument();
  expect(checkbox).not.toBeChecked();
  expect(screen.queryByText("Активных задач: 1")).toBeInTheDocument();
  expect(screen.queryByText("Активных задач: 0")).not.toBeInTheDocument();
  await userEvent.click(checkbox);
  expect(screen.queryByText("Активных задач: 0")).toBeInTheDocument();
  expect(screen.queryByText("Активных задач: 1")).not.toBeInTheDocument();
  expect(checkbox).toBeChecked();
  await userEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});

test("Toggle switcher", async () => {
  render(<App />);
  expect(screen.queryByRole("checkbox")).not.toBeChecked();
  await userEvent.click(screen.getByText("Все"));
  expect(screen.queryByRole("checkbox")).toBeInTheDocument();
  await userEvent.click(screen.getByText("Активные"));
  expect(screen.queryByRole("checkbox")).toBeInTheDocument();
  await userEvent.click(screen.getByText("Выполненные"));
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  await userEvent.click(screen.getByText("Все"));
  await userEvent.click(screen.getByRole("checkbox"));
  expect(screen.queryByRole("checkbox")).toBeChecked();
  expect(screen.queryByRole("checkbox")).toBeInTheDocument();
  await userEvent.click(screen.getByText("Активные"));
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  await userEvent.click(screen.getByText("Выполненные"));
  expect(screen.queryByRole("checkbox")).toBeInTheDocument();
});

test("Delete task", async () => {
  render(<App />);
  await userEvent.click(screen.getByText("Все"));
  const checkbox = screen.queryByRole("checkbox");
  expect(checkbox).toBeChecked();
  const deleteButton = screen.getByText("Очистить выполненные задачи");
  expect(checkbox).toBeInTheDocument();
  expect(screen.getByRole("list").children.length).toEqual(1);
  await userEvent.click(deleteButton);
  expect(checkbox).not.toBeInTheDocument();
  expect(screen.getByRole("list").children.length).toEqual(0);
});
