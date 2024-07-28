"use client";
import React, { useEffect } from "react";
import { Task } from "@/interfaces/task.interface";
import { useAppDispatch, useAppSelector } from "@/redux/redux.hooks";
import { openSheet } from "@/redux/slice/toggle.slice";
import { fetchTasksThunk, updateTaskThunk } from "@/redux/thunk/task.thunk";
import { AlignLeft, Plus } from "lucide-react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { updateTaskStatus, TaskStatus } from "@/redux/slice/taskStatus.slice";
import TaskCard from "./TaskCard";

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface BoardState {
  [key: string]: Column;
}

// Helper function to format date
const formatDate = (isoDate: Date): string => {
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0];
};

// Board component
const Board: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((s) => s.task);

  useEffect(() => {
    dispatch(fetchTasksThunk());
  }, [dispatch]);

  const handleClick = (status: TaskStatus) => {
    dispatch(openSheet());
    dispatch(updateTaskStatus(status));
  };

  const columns: BoardState = {
    todo: {
      id: TaskStatus.ToDo,
      title: "To Do",
      tasks: tasks.filter((task) => task.status === TaskStatus.ToDo),
    },
    inprogress: {
      id: TaskStatus.InProgress,
      title: "In Progress",
      tasks: tasks.filter((task) => task.status === TaskStatus.InProgress),
    },
    review: {
      id: TaskStatus.UnderReview,
      title: "Under Review",
      tasks: tasks.filter((task) => task.status === TaskStatus.UnderReview),
    },
    finished: {
      id: TaskStatus.Finished,
      title: "Finished",
      tasks: tasks.filter((task) => task.status === TaskStatus.Finished),
    },
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      // Moving within the same column
      const updatedTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, movedTask);

      dispatch(
        updateTaskThunk({
          ...movedTask,
          status: sourceColumn.id as TaskStatus,
        })
      );
    } else {
      // Moving between columns
      const sourceTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, movedTask);

      dispatch(
        updateTaskThunk({
          ...movedTask,
          status: destColumn.id as TaskStatus,
        })
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
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
                  {column.tasks.map((task, index) => {
                    // Ensure task._id is used as draggableId
                    const draggableId =
                      task._id || `draggable-${task.title}-${index}`;

                    return (
                      <Draggable
                        key={draggableId}
                        draggableId={draggableId}
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
                              description={task.description!}
                              badge={task.priority}
                              date={formatDate(task.deadline)}
                              time={formatDate(task.deadline)}
                              status={task.status}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  <button
                    className="w-full mt-3 flex items-center justify-between bg-black-gradient text-white p-2 rounded-md"
                    onClick={() => handleClick(column.id as TaskStatus)}
                  >
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
