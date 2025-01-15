"use client";

import React, { Dispatch, SetStateAction, useState, DragEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus, Trash, Flame } from "lucide-react";

interface Task {
  id: string;
  projectID: string;
  title: string;
  type: "FEATURE" | "BUG" | "TASK";
  description?: string;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
  isCompleted: boolean;
  isPinned: boolean;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomKanbanProps {
  data: Task[];
}

export const CustomKanban: React.FC<CustomKanbanProps> = ({ data }) => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board initialCards={data} />
    </div>
  );
};

const Board: React.FC<{ initialCards: Task[] }> = ({ initialCards }) => {
  const [cards, setCards] = useState(initialCards);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      {[
        { title: "Backlog", status: "BACKLOG", color: "text-neutral-500" },
        { title: "TODO", status: "TODO", color: "text-yellow-200" },
        { title: "In Progress", status: "IN_PROGRESS", color: "text-blue-200" },
        { title: "Complete", status: "DONE", color: "text-emerald-200" },
      ].map(({ title, status, color }) => (
        <Column
          key={status}
          title={title}
          column={status as Task["status"]}
          headingColor={color}
          cards={cards}
          setCards={setCards}
        />
      ))}
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: Task[];
  column: Task["status"];
  setCards: Dispatch<SetStateAction<Task[]>>;
};

const Column: React.FC<ColumnProps> = ({ title, headingColor, cards, column, setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: Task) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDrop = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);

    const updatedCards = cards.map((card) => {
      if (card.id === cardId) {
        return { ...card, status: column };
      }
      return card;
    });

    setCards(updatedCards);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const filteredCards = cards.filter((card) => card.status === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full p-2 rounded transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((card) => (
          <Card key={card.id} card={card} handleDragStart={handleDragStart} />
        ))}
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

type CardProps = {
  card: Task;
  handleDragStart: (e: DragEvent, card: Task) => void;
};

const Card: React.FC<CardProps> = ({ card, handleDragStart }) => {
  const { id, title, priority, type } = card;

  return (
    <motion.div
      layout
      draggable="true"
      onDragStart={(e) => handleDragStart(e, card)}
      className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 mb-2 active:cursor-grabbing"
    >
      <p className="text-sm text-neutral-100">{title}</p>
      <div className="mt-2 flex justify-between text-xs">
        <span className={`px-2 py-1 rounded ${getPriorityColor(priority)}`}>{priority}</span>
        <span className={`px-2 py-1 rounded ${getTypeColor(type)}`}>{type}</span>
      </div>
    </motion.div>
  );
};

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-500 text-white";
    case "MEDIUM":
      return "bg-yellow-500 text-black";
    case "LOW":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getTypeColor = (type: Task["type"]) => {
  switch (type) {
    case "FEATURE":
      return "bg-blue-500 text-white";
    case "BUG":
      return "bg-red-500 text-white";
    case "TASK":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

type AddCardProps = {
  column: Task["status"];
  setCards: Dispatch<SetStateAction<Task[]>>;
};

const AddCard: React.FC<AddCardProps> = ({ column, setCards }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim()) return;

    const newCard: Task = {
      id: crypto.randomUUID(),
      projectID: "temp-project-id",
      title: text.trim(),
      type: "TASK",
      status: column,
      isCompleted: false,
      isPinned: false,
      priority: "MEDIUM",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCards((prev) => [...prev, newCard]);
    setText("");
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit} className="mt-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add a new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-2 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3 py-1 text-sm text-neutral-400 hover:text-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-1 text-sm text-neutral-950 hover:bg-neutral-300"
            >
              Add <Plus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="mt-2 w-full text-sm text-neutral-400 hover:text-neutral-50"
        >
          Add Card <Plus />
        </motion.button>
      )}
    </>
  );
};

const BurnBarrel: React.FC<{ setCards: Dispatch<SetStateAction<Task[]>> }> = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    setActive(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-10 flex h-56 w-56 items-center justify-center rounded border transition-all ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <Flame /> : <Trash />}
    </div>
  );
};
