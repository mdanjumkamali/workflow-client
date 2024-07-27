"use client";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { AlignLeft, Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  badge: string;
  date: string;
  time: string;
  status: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface BoardState {
  [key: string]: Column;
}

const Board: React.FC = () => {
  const [columns, setColumns] = useState<BoardState>({
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "1",
          title: "Implement User Authentication",
          description:
            "Develop and integrate user authentication using email and password.",
          badge: "Urgent",
          date: "2024-08-15",
          time: "1 hr ago",
          status: "To Do",
        },
        {
          id: "2",
          title: "Design Landing Page",
          description: "Create a responsive design for the main landing page.",
          badge: "High",
          date: "2024-08-20",
          time: "3 hrs ago",
          status: "To Do",
        },
      ],
    },
    inprogress: {
      id: "inprogress",
      title: "In Progress",
      tasks: [
        {
          id: "3",
          title: "Implement RESTful API",
          description: "Develop backend API endpoints for core functionality.",
          badge: "High",
          date: "2024-08-18",
          time: "2 days ago",
          status: "In Progress",
        },
      ],
    },
    review: {
      id: "review",
      title: "Under Review",
      tasks: [
        {
          id: "4",
          title: "User Profile Feature",
          description:
            "Implement user profile editing and viewing functionality.",
          badge: "Low",
          date: "2024-08-17",
          time: "4 days ago",
          status: "Under Review",
        },
      ],
    },
    finished: {
      id: "finished",
      title: "Finished",
      tasks: [
        {
          id: "5",
          title: "Project Setup",
          description:
            "Initialize project repository and set up development environment.",
          badge: "Low",
          date: "2024-08-10",
          time: "1 week ago",
          status: "Finished",
        },
      ],
    },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const updatedTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, movedTask);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: updatedTasks,
        },
      }));
    } else {
      const sourceTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);

      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, movedTask);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks,
        },
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 p-4">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="w-full md:w-1/4 rounded-lg p-4">
            <div className="flex items-center justify-between text-[#555555] my-2">
              <p className="text-md">{column.title}</p>
              <AlignLeft />
            </div>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[500px]"
                >
                  {column.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-4"
                        >
                          <TaskCard
                            title={task.title}
                            description={task.description}
                            badge={task.badge}
                            date={task.date}
                            time={task.time}
                            status={task.status}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <button className="w-full mt-3 flex items-center justify-between bg-black-gradient text-white p-2 rounded-md">
                    Add New
                    <Plus />
                  </button>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
