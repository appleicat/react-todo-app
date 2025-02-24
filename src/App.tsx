import "./App.css";
import { useState, useEffect } from "react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}
type Switcher = "all" | "active" | "completed";

const LOCALSTORAGE_TASKS = "react-todo-app.tasks";
const SESSIONSTORAGE_SWITCHER = "react-todo-app.switcher";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const localStorageTasks = localStorage.getItem(LOCALSTORAGE_TASKS);
    return localStorageTasks ? JSON.parse(localStorageTasks) : [];
  });
  const [taskInput, setTaskInput] = useState<string>("");
  const [switcher, setSwitcher] = useState<Switcher>(() => {
    const sessionStorageSwitcher = sessionStorage.getItem(
      SESSIONSTORAGE_SWITCHER
    ) as Switcher;
    return sessionStorageSwitcher ?? "active";
  });

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    sessionStorage.setItem(SESSIONSTORAGE_SWITCHER, switcher);
  }, [switcher]);

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([
        ...tasks,
        { text: taskInput, completed: false, id: crypto.randomUUID() },
      ]);
      setTaskInput("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const activeTasksCount: number = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <div className="h-screen p-10 flex flex-col gap-10">
      <header className="flex flex-wrap items-center min-h-10 gap-x-10 gap-y-1">
        <div className="border rounded h-10 flex items-center">
          <input
            type="text"
            value={taskInput}
            onChange={(event) => {
              setTaskInput(event.target.value);
            }}
            placeholder="Новая задача"
            className="px-4 size-full"
          />
          <button
            onClick={() => {
              addTask();
            }}
            className="px-3 pb-0.5 h-full hover:text-white hover:bg-black transition-colors"
          >
            Добавить
          </button>
        </div>
        <div className="border rounded h-10 flex items-center">
          <button
            className={`px-3 pb-0.5 h-full hover:text-white hover:bg-black transition-colors ${
              switcher === "all" ? "underline underline-offset-5" : ""
            }`}
            onClick={() => {
              setSwitcher("all");
            }}
          >
            Все
          </button>
          <button
            className={`px-3 pb-0.5 h-full hover:text-white hover:bg-black transition-colors ${
              switcher === "active" ? "underline underline-offset-5" : ""
            }`}
            onClick={() => {
              setSwitcher("active");
            }}
          >
            Активные
          </button>
          <button
            className={`px-3 pb-0.5 h-full hover:text-white hover:bg-black transition-colors ${
              switcher === "completed" ? "underline underline-offset-5" : ""
            }`}
            onClick={() => {
              setSwitcher("completed");
            }}
          >
            Выполненные
          </button>
        </div>
        <div>Активных задач: {activeTasksCount}</div>
        <div className="h-10 rounded border">
          <button
            className="px-3 pb-0.5 h-full hover:text-white hover:bg-black transition-colors"
            onClick={() => {
              clearCompletedTasks();
            }}
          >
            Очистить выполненные задачи
          </button>
        </div>
      </header>
      <main className="flex-auto w-full overflow-y-auto">
        <ul className="flex flex-col gap-3">
          {tasks
            .filter((task) =>
              switcher === "active"
                ? !task.completed
                : switcher === "completed"
                ? task.completed
                : task
            )
            .map((task, index) => (
              <li key={index} className="flex gap-5">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onClick={() => {
                    toggleTask(task.id);
                  }}
                />
                <div>{task.text}</div>
              </li>
            ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
