// "use client"

// import type React from "react"
// import { useState, type DragEvent } from "react"
// import { motion } from "framer-motion"
// import { Trash, Flame } from "lucide-react"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import type { Task } from "@/utils/types"
// import { useIsMobile } from "@/hooks/use-mobile"

// interface CustomKanbanProps {
//   data: Task[]
// }

// const updateTask = async (taskId: string, data: Partial<Task>) => {
//   const res = await fetch(`/api/tasks/${taskId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   })
//   if (!res.ok) throw new Error("Failed to update task")
//   return res.json()
// }

// const deleteTask = async (taskId: string) => {
//   const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
//   if (!res.ok) throw new Error("Failed to delete task")
//   return res.json()
// }

// const CustomKanban: React.FC<CustomKanbanProps> = ({ data }) => {
//   const isMobile = useIsMobile()

//   return (
//     <div className={`h-full w-full text-neutral-50 ${isMobile ? "overflow-x-auto" : ""}`}>
//       <Board initialCards={data} isMobile={isMobile} />
//     </div>
//   )
// }

// const Board: React.FC<{ initialCards: Task[]; isMobile: boolean }> = ({ initialCards, isMobile }) => {
//   const [cards, setCards] = useState(initialCards)
//   const queryClient = useQueryClient()

//   const updateTaskMutation = useMutation({
//     mutationFn: ({
//       taskId,
//       data,
//     }: {
//       taskId: string
//       data: Partial<Task>
//     }) => updateTask(taskId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["tasks"] })
//     },
//   })

//   const deleteTaskMutation = useMutation({
//     mutationFn: deleteTask,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["tasks"] })
//     },
//   })

//   const handleUpdateTask = (taskId: string, data: Partial<Task>) => {
//     updateTaskMutation.mutate({ taskId, data })
//   }

//   const handleDeleteTask = (taskId: string) => {
//     deleteTaskMutation.mutate(taskId)
//   }

//   return (
//     <div className={`flex h-full ${isMobile ? "w-max" : "w-full"} gap-3 overflow-hidden p-0`}>
//       <Column
//         title="Backlog"
//         column="BACKLOG"
//         headingColor="text-neutral-500"
//         cards={cards}
//         setCards={setCards}
//         onUpdateTask={handleUpdateTask}
//         isMobile={isMobile}
//       />
//       <Column
//         title="TODO"
//         column="TODO"
//         headingColor="text-yellow-200"
//         cards={cards}
//         setCards={setCards}
//         onUpdateTask={handleUpdateTask}
//         isMobile={isMobile}
//       />
//       <Column
//         title="In progress"
//         column="IN_PROGRESS"
//         headingColor="text-blue-200"
//         cards={cards}
//         setCards={setCards}
//         onUpdateTask={handleUpdateTask}
//         isMobile={isMobile}
//       />
//       <Column
//         title="Complete"
//         column="DONE"
//         headingColor="text-emerald-200"
//         cards={cards}
//         setCards={setCards}
//         onUpdateTask={handleUpdateTask}
//         isMobile={isMobile}
//       />
//       <BurnBarrel setCards={setCards} onDeleteTask={handleDeleteTask} isMobile={isMobile} />
//     </div>
//   )
// }

// type ColumnProps = {
//   title: string
//   headingColor: string
//   cards: Task[]
//   column: Task["status"]
//   setCards: React.Dispatch<React.SetStateAction<Task[]>>
//   onUpdateTask: (taskId: string, data: Partial<Task>) => void
// }

// const Column = ({
//   title,
//   headingColor,
//   cards,
//   column,
//   setCards,
//   onUpdateTask,
//   isMobile,
// }: ColumnProps & { isMobile: boolean }) => {
//   const [active, setActive] = useState(false)

//   const handleDragStart = (e: DragEvent, card: Task) => {
//     e.dataTransfer.setData("cardId", card.id)
//   }

//   const handleDragEnd = (e: DragEvent) => {
//     const cardId = e.dataTransfer.getData("cardId")

//     setActive(false)
//     clearHighlights()

//     const indicators = getIndicators()
//     const { element } = getNearestIndicator(e, indicators)

//     const before = element.dataset.before || "-1"

//     if (before !== cardId) {
//       let copy = [...cards]

//       let cardToTransfer = copy.find((c) => c.id === cardId)
//       if (!cardToTransfer) return
//       cardToTransfer = { ...cardToTransfer, status: column }

//       copy = copy.filter((c) => c.id !== cardId)

//       const moveToBack = before === "-1"

//       if (moveToBack) {
//         copy.push(cardToTransfer)
//       } else {
//         const insertAtIndex = copy.findIndex((el) => el.id === before)
//         if (insertAtIndex === undefined) return

//         copy.splice(insertAtIndex, 0, cardToTransfer)
//       }

//       setCards(copy)
//       onUpdateTask(cardId, { status: column })
//     }
//   }

//   const handleDragOver = (e: DragEvent) => {
//     e.preventDefault()
//     highlightIndicator(e)

//     setActive(true)
//   }

//   const clearHighlights = (els?: HTMLElement[]) => {
//     const indicators = els || getIndicators()

//     indicators.forEach((i) => {
//       i.style.opacity = "0"
//     })
//   }

//   const highlightIndicator = (e: DragEvent) => {
//     const indicators = getIndicators()

//     clearHighlights(indicators)

//     const el = getNearestIndicator(e, indicators)

//     el.element.style.opacity = "1"
//   }

//   const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
//     const DISTANCE_OFFSET = 50

//     const el = indicators.reduce(
//       (closest, child) => {
//         const box = child.getBoundingClientRect()

//         const offset = e.clientY - (box.top + DISTANCE_OFFSET)

//         if (offset < 0 && offset > closest.offset) {
//           return { offset: offset, element: child }
//         } else {
//           return closest
//         }
//       },
//       {
//         offset: Number.NEGATIVE_INFINITY,
//         element: indicators[indicators.length - 1],
//       },
//     )

//     return el
//   }

//   const getIndicators = () => {
//     return Array.from(document.querySelectorAll(`[data-column="${column}"]`) as unknown as HTMLElement[])
//   }

//   const handleDragLeave = () => {
//     clearHighlights()
//     setActive(false)
//   }

//   const filteredCards = cards.filter((c) => c.status === column)

//   return (
//     <div className={`w-56 ${isMobile ? "flex-shrink-0" : "shrink-0"}`}>
//       <div className="mb-3 flex items-center justify-between">
//         <h3 className={`font-medium ${headingColor}`}>{title}</h3>
//         <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
//       </div>
//       <div
//         onDrop={handleDragEnd}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         className="h-full w-full transition-colors"
//       >
//         {filteredCards.map((c) => {
//           return <Card key={c.id} {...c} handleDragStart={handleDragStart} />
//         })}
//         <DropIndicator beforeId={null} column={column} />
//         {/* <AddCard column={column} setCards={setCards} /> */}
//       </div>
//     </div>
//   )
// }

// type CardProps = Task & {
//   handleDragStart: (e: DragEvent, card: Task) => void
// }

// const Card = ({ title, id, status, handleDragStart, priority, type, dueDate }: CardProps) => {
//   return (
//     <>
//       <DropIndicator beforeId={id} column={status} />
//       <motion.div
//         layout
//         layoutId={id}
//         draggable="true"
//         onDragStart={(e) =>
//           handleDragStart(e, {
//             id,
//             title,
//             status,
//             priority,
//             type,
//             dueDate,
//           } as Task)
//         }
//         className="cursor-grab rounded border border-neutral-700 bg-slate-950 p-3 active:cursor-grabbing"
//       >
//         <p className="text-sm text-neutral-100">{title}</p>
//         <div className="mt-2 flex flex-wrap justify-between text-xs">
//           <span className={`px-2 py-1 rounded ${getPriorityColor(priority)}`}>{priority}</span>
//           <span className={`px-2 py-1 rounded ${getTypeColor(type)}`}>{type}</span>
//         </div>
//         {dueDate && <p className="mt-2 text-xs text-neutral-400">Due: {new Date(dueDate).toLocaleDateString()}</p>}
//       </motion.div>
//     </>
//   )
// }

// const getPriorityColor = (priority: Task["priority"]) => {
//   switch (priority) {
//     case "HIGH":
//       return "bg-red-500 text-white"
//     case "MEDIUM":
//       return "bg-yellow-500 text-black"
//     case "LOW":
//       return "bg-green-500 text-white"
//     default:
//       return "bg-gray-500 text-white"
//   }
// }

// const getTypeColor = (type: Task["type"]) => {
//   switch (type) {
//     case "FEATURE":
//       return "bg-blue-500 text-white"
//     case "BUG":
//       return "bg-red-500 text-white"
//     case "TASK":
//       return "bg-green-500 text-white"
//     default:
//       return "bg-gray-500 text-white"
//   }
// }

// type DropIndicatorProps = {
//   beforeId: string | null
//   column: Task["status"]
// }

// const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
//   return (
//     <div data-before={beforeId || "-1"} data-column={column} className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0" />
//   )
// }

// const BurnBarrel = ({
//   setCards,
//   onDeleteTask,
//   isMobile,
// }: {
//   setCards: React.Dispatch<React.SetStateAction<Task[]>>
//   onDeleteTask: (taskId: string) => void
//   isMobile: boolean
// }) => {
//   const [active, setActive] = useState(false)

//   const handleDragOver = (e: DragEvent) => {
//     e.preventDefault()
//     setActive(true)
//   }

//   const handleDragLeave = () => {
//     setActive(false)
//   }

//   const handleDragEnd = (e: DragEvent) => {
//     const cardId = e.dataTransfer.getData("cardId")

//     setCards((pv) => pv.filter((c) => c.id !== cardId))
//     onDeleteTask(cardId)

//     setActive(false)
//   }

//   return (
//     <div
//       onDrop={handleDragEnd}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       className={`mt-10 grid h-56 ${isMobile ? "w-40" : "w-56"} shrink-0 place-content-center rounded border text-3xl ${
//         active ? "border-red-800 bg-red-800/20 text-red-500" : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
//       }`}
//     >
//       {active ? <Flame /> : <Trash />}
//     </div>
//   )
// }

// {
//   /*
// const AddCard = ({ column, setCards }: AddCardProps) => {
//   const [text, setText] = useState("");
//   const [adding, setAdding] = useState(false);

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!text.trim().length) return;

//     const newCard: Task = {
//       id: Math.random().toString(),
//       projectID: "temp-project-id", // This should be replaced with the actual project ID
//       title: text.trim(),
//       type: "TASK", // Default type
//       status: column,
//       isCompleted: false,
//       isPinned: false,
//       priority: "MEDIUM", // Default priority
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     setCards((pv) => [...pv, newCard]);
//     setAdding(false);
//     setText("");
//   };

//   return (
//     <>
//       {adding ? (
//         <motion.form layout onSubmit={handleSubmit}>
//           <textarea
//             onChange={(e) => setText(e.target.value)}
//             autoFocus
//             placeholder="Add new task..."
//             className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
//           />
//           <div className="mt-1.5 flex items-center justify-end gap-1.5">
//             <button
//               onClick={() => setAdding(false)}
//               className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
//             >
//               Close
//             </button>
//             <button
//               type="submit"
//               className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
//             >
//               <span>Add</span>
//               <Plus />
//             </button>
//           </div>
//         </motion.form>
//       ) : (
//         <motion.button
//           layout
//           onClick={() => setAdding(true)}
//           className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
//         >
//           <span>Add card</span>
//           <Plus />
//         </motion.button>
//       )}
//     </>
//   );
// };
// */
// }

// type AddCardProps = {
//   column: Task["status"]
//   setCards: React.Dispatch<React.SetStateAction<Task[]>>
// }

// export default CustomKanban

"use client";

import React, { useState, useEffect, DragEvent } from "react";
import { motion } from "framer-motion";
import { Trash, Flame } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { Task } from "@/utils/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjectContext } from "@/contexts/project-context";

// API calls for updating and deleting a task
const updateTask = async (taskId: string, data: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
};

const deleteTask = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
    return res.json();
};

const CustomKanban: React.FC = () => {
    const isMobile = useIsMobile();
    const { projectData, refetchProject } = useProjectContext();
    const [cards, setCards] = useState<Task[]>(projectData?.tasks || []);

    // Whenever projectData updates (via context refetch), update our local state.
    useEffect(() => {
        setCards(projectData?.tasks || []);
    }, [projectData]);

    return (
        <div
            className={`h-full w-full text-neutral-50 ${isMobile ? "overflow-x-auto" : ""}`}
        >
            <Board
                initialCards={cards}
                setCards={setCards}
                isMobile={isMobile}
                refetchProject={refetchProject}
            />
        </div>
    );
};

type BoardProps = {
    initialCards: Task[];
    setCards: React.Dispatch<React.SetStateAction<Task[]>>;
    isMobile: boolean;
    refetchProject: () => void;
};

const Board: React.FC<BoardProps> = ({
    initialCards,
    setCards,
    isMobile,
    refetchProject,
}) => {
    const updateTaskMutation = useMutation({
        mutationFn: ({
            taskId,
            data,
        }: {
            taskId: string;
            data: Partial<Task>;
        }) => updateTask(taskId, data),
        onSuccess: () => {
            refetchProject();
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            refetchProject();
        },
    });

    const handleUpdateTask = (taskId: string, data: Partial<Task>) => {
        updateTaskMutation.mutate({ taskId, data });
    };

    const handleDeleteTask = (taskId: string) => {
        deleteTaskMutation.mutate(taskId);
    };

    return (
        <div
            className={`flex h-full ${isMobile ? "w-max" : "w-full"} gap-3 overflow-hidden p-0`}
        >
            <Column
                title="Backlog"
                column="BACKLOG"
                headingColor="text-neutral-500"
                cards={initialCards}
                setCards={setCards}
                onUpdateTask={handleUpdateTask}
                isMobile={isMobile}
            />
            <Column
                title="TODO"
                column="TODO"
                headingColor="text-yellow-200"
                cards={initialCards}
                setCards={setCards}
                onUpdateTask={handleUpdateTask}
                isMobile={isMobile}
            />
            <Column
                title="In progress"
                column="IN_PROGRESS"
                headingColor="text-blue-200"
                cards={initialCards}
                setCards={setCards}
                onUpdateTask={handleUpdateTask}
                isMobile={isMobile}
            />
            <Column
                title="Complete"
                column="DONE"
                headingColor="text-emerald-200"
                cards={initialCards}
                setCards={setCards}
                onUpdateTask={handleUpdateTask}
                isMobile={isMobile}
            />
            <BurnBarrel
                setCards={setCards}
                onDeleteTask={handleDeleteTask}
                isMobile={isMobile}
            />
        </div>
    );
};

type ColumnProps = {
    title: string;
    headingColor: string;
    cards: Task[];
    column: Task["status"];
    setCards: React.Dispatch<React.SetStateAction<Task[]>>;
    onUpdateTask: (taskId: string, data: Partial<Task>) => void;
    isMobile: boolean;
};

const Column = ({
    title,
    headingColor,
    cards,
    column,
    setCards,
    onUpdateTask,
    isMobile,
}: ColumnProps) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e: DragEvent, card: Task) => {
        e.dataTransfer.setData("cardId", card.id);
    };

    const handleDragEnd = (e: DragEvent) => {
        const cardId = e.dataTransfer.getData("cardId");

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);
        const before = element.dataset.before || "-1";

        if (before !== cardId) {
            let copy = [...cards];
            let cardToTransfer = copy.find((c) => c.id === cardId);
            if (!cardToTransfer) return;
            cardToTransfer = { ...cardToTransfer, status: column };

            copy = copy.filter((c) => c.id !== cardId);
            const moveToBack = before === "-1";
            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before);
                if (insertAtIndex === undefined) return;
                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            setCards(copy);
            onUpdateTask(cardId, { status: column });
        }
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        highlightIndicator(e);
        setActive(true);
    };

    const clearHighlights = (els?: HTMLElement[]) => {
        const indicators = els || getIndicators();
        indicators.forEach((i) => {
            i.style.opacity = "0";
        });
    };

    const highlightIndicator = (e: DragEvent) => {
        const indicators = getIndicators();
        clearHighlights(indicators);
        const el = getNearestIndicator(e, indicators);
        el.element.style.opacity = "1";
    };

    const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
        const DISTANCE_OFFSET = 50;
        const el = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientY - (box.top + DISTANCE_OFFSET);
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );
        return el;
    };

    const getIndicators = () => {
        return Array.from(
            document.querySelectorAll(
                `[data-column="${column}"]`
            ) as NodeListOf<HTMLElement>
        );
    };

    const handleDragLeave = () => {
        clearHighlights();
        setActive(false);
    };

    const filteredCards = cards.filter((c) => c.status === column);

    return (
        <div className={`w-56 ${isMobile ? "flex-shrink-0" : "shrink-0"}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">
                    {filteredCards.length}
                </span>
            </div>
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className="h-full w-full transition-colors"
            >
                {filteredCards.map((c) => (
                    <Card key={c.id} {...c} handleDragStart={handleDragStart} />
                ))}
                <DropIndicator beforeId={null} column={column} />
            </div>
        </div>
    );
};

type CardProps = Task & {
    handleDragStart: (e: DragEvent, card: Task) => void;
};

const Card = ({
    title,
    id,
    status,
    handleDragStart,
    priority,
    type,
    dueDate,
}: CardProps) => {
    return (
        <>
            <DropIndicator beforeId={id} column={status} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) =>
                    handleDragStart(e, {
                        id,
                        title,
                        status,
                        priority,
                        type,
                        dueDate,
                    } as Task)
                }
                className="cursor-grab rounded border border-neutral-700 bg-slate-950 p-3 active:cursor-grabbing"
            >
                <p className="text-sm text-neutral-100">{title}</p>
                <div className="mt-2 flex flex-wrap justify-between text-xs">
                    <span
                        className={`px-2 py-1 rounded ${getPriorityColor(priority)}`}
                    >
                        {priority}
                    </span>
                    <span className={`px-2 py-1 rounded ${getTypeColor(type)}`}>
                        {type}
                    </span>
                </div>
                {dueDate && (
                    <p className="mt-2 text-xs text-neutral-400">
                        Due: {new Date(dueDate).toLocaleDateString()}
                    </p>
                )}
            </motion.div>
        </>
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

type DropIndicatorProps = {
    beforeId: string | null;
    column: Task["status"];
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
    return (
        <div
            data-before={beforeId || "-1"}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
        />
    );
};

const BurnBarrel = ({
    setCards,
    onDeleteTask,
    isMobile,
}: {
    setCards: React.Dispatch<React.SetStateAction<Task[]>>;
    onDeleteTask: (taskId: string) => void;
    isMobile: boolean;
}) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = (e: DragEvent) => {
        const cardId = e.dataTransfer.getData("cardId");
        setCards((pv) => pv.filter((c) => c.id !== cardId));
        onDeleteTask(cardId);
        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid h-56 ${isMobile ? "w-40" : "w-56"} shrink-0 place-content-center rounded border text-3xl ${
                active
                    ? "border-red-800 bg-red-800/20 text-red-500"
                    : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
            }`}
        >
            {active ? <Flame /> : <Trash />}
        </div>
    );
};

export default CustomKanban;
