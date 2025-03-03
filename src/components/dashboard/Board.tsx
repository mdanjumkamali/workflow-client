"use client";

import { Task } from "@/interfaces/task.interface";
import { useAppDispatch, useAppSelector } from "@/redux/redux.hooks";
import { setSelectedTask } from "@/redux/slice/task.slice";
import { TaskStatus, updateTaskStatus } from "@/redux/slice/taskStatus.slice";
import { openSheet } from "@/redux/slice/toggle.slice";
import {
  deleteTaskThunk,
  fetchTasksThunk,
  updateTaskThunk,
} from "@/redux/thunk/task.thunk";
import { AlignLeft, Plus } from "lucide-react";
import React, { useEffect, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import moment from "moment";
import { Skeleton } from "../ui/skeleton";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

interface BoardState {
  [key: string]: Column;
}

interface BoardProps {
  filterStatus: string | null;
  filterPriority: string | null;
  sortOrder: string | null;
}

// Helper function to format date
const formatDate = (isoDate: Date): string => {
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0];
};

const createdDate = (timestamp: Date) => {
  const relativeTime = moment(timestamp).fromNow();
  return relativeTime;
};

// Board component
const Board: React.FC<BoardProps> = ({
  filterStatus,
  filterPriority,
  sortOrder,
}) => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((s) => s.task);

  useEffect(() => {
    dispatch(fetchTasksThunk());
  }, [dispatch]);

  // Optimize event handlers with useCallback
  const handleDeleteTask = useCallback(
    (taskId: string) => {
      dispatch(deleteTaskThunk(taskId));
      toast.success("Task deleted successfully!");
    },
    [dispatch]
  );

  const handleTaskClick = useCallback(
    (task: Task) => {
      dispatch(setSelectedTask(task));
      dispatch(openSheet());
    },
    [dispatch]
  );

  // Memoize filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = [...tasks];

    // Apply status filter
    if (filterStatus === "completed") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === TaskStatus.Finished
      );
    } else if (filterStatus === "pending") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status !== TaskStatus.Finished
      );
    }

    // Apply priority filter
    if (filterPriority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority.toLowerCase() === filterPriority.toLowerCase()
      );
    }

    // Apply sorting
    if (sortOrder) {
      return [...filteredTasks].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
    }

    return filteredTasks;
  }, [tasks, filterStatus, filterPriority, sortOrder]);

  // Memoize columns to prevent unnecessary recalculations
  const columns = useMemo(
    () => ({
      [TaskStatus.ToDo]: {
        id: TaskStatus.ToDo,
        title: "To Do",
        tasks: filteredAndSortedTasks.filter(
          (task) => task.status === TaskStatus.ToDo
        ),
      },
      [TaskStatus.InProgress]: {
        id: TaskStatus.InProgress,
        title: "In Progress",
        tasks: filteredAndSortedTasks.filter(
          (task) => task.status === TaskStatus.InProgress
        ),
      },
      [TaskStatus.UnderReview]: {
        id: TaskStatus.UnderReview,
        title: "Under Review",
        tasks: filteredAndSortedTasks.filter(
          (task) => task.status === TaskStatus.UnderReview
        ),
      },
      [TaskStatus.Finished]: {
        id: TaskStatus.Finished,
        title: "Finished",
        tasks: filteredAndSortedTasks.filter(
          (task) => task.status === TaskStatus.Finished
        ),
      },
    }),
    [filteredAndSortedTasks]
  );

  // Memoize active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterStatus) count++;
    if (filterPriority) count++;
    if (sortOrder) count++;
    return count;
  }, [filterStatus, filterPriority, sortOrder]);

  const handleClick = (status: TaskStatus) => {
    dispatch(openSheet());
    dispatch(updateTaskStatus(status));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      console.log("Dropped outside of any droppable area");
      return;
    }

    const sourceColumn = columns[source.droppableId as TaskStatus];
    const destColumn = columns[destination.droppableId as TaskStatus];

    if (!sourceColumn || !destColumn) {
      console.error("Source or destination column is undefined");
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Handle drag within the same column
      const updatedTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, movedTask);

      dispatch(
        updateTaskThunk({
          ...movedTask,
          status: sourceColumn.id,
        })
      );
    } else {
      // Handle drag between columns
      const sourceTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, movedTask);

      dispatch(
        updateTaskThunk({
          ...movedTask,
          status: destColumn.id,
        })
      );
    }
  };

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {loading &&
          Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-[125px] w-full rounded-xl" />
              </div>
            ))}
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-screen dark:bg-[#FAF9F6]">
        {Object.values(columns).map((column) => (
          <div
            key={column.id}
            className="w-full rounded-lg p-2 md:p-4 bg-gray-50/50"
          >
            <div className="flex items-center justify-between text-[#555555] my-2">
              <p className="text-sm md:text-md font-medium">{column.title}</p>
              <AlignLeft className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[300px] md:min-h-[500px]"
                >
                  {column.tasks.map((task, index) => {
                    const draggableId = task._id!;

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
                            className="mb-3 md:mb-4"
                          >
                            <TaskCard
                              title={task.title}
                              description={task.description!}
                              badge={task.priority}
                              date={formatDate(task.deadline)}
                              time={createdDate(task.updatedAt!)}
                              status={task.status}
                              onDelete={() => handleDeleteTask(task._id!)}
                              onEdit={() => handleTaskClick(task)}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}

                  <Button
                    className="w-full mt-2 md:mt-3 flex items-center justify-between  text-white p-2 rounded-md text-sm dark:bg-black"
                    onClick={() => handleClick(column.id)}
                  >
                    <span>Add New</span>
                    <Plus className="h-4 w-4" />
                  </Button>
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
