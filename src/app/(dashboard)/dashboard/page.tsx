"use client";

import Board from "@/components/dashboard/Board";
import Sheet from "@/components/dashboard/ToggleSheet";
import { useAppDispatch, useAppSelector } from "@/redux/redux.hooks";
import { TaskStatus, updateTaskStatus } from "@/redux/slice/taskStatus.slice";
import { openSheet } from "@/redux/slice/toggle.slice";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  CirclePlus,
  Filter,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const Page = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.user.name);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>(null);

  const handleClick = (status: TaskStatus) => {
    dispatch(openSheet());
    dispatch(updateTaskStatus(status));
  };

  const handleFilterStatus = (status: string) => {
    setFilterStatus(status === filterStatus ? null : status);
  };

  const handleFilterPriority = (priority: string) => {
    setFilterPriority(priority === filterPriority ? null : priority);
  };

  const handleSort = (order: string) => {
    setSortOrder(order === sortOrder ? null : order);
  };

  const isAnyFilterActive = useMemo(
    () =>
      filterStatus !== null || filterPriority !== null || sortOrder !== null,
    [filterStatus, filterPriority, sortOrder]
  );

  const clearAllFilters = () => {
    setFilterStatus(null);
    setFilterPriority(null);
    setSortOrder(null);
  };

  return (
    <div className="flex flex-col px-2 sm:px-4 py-4 sm:py-6 h-screen bg-[#F7F7F7]">
      {/* greeting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold dark:text-black">
            Hello, {username || "User"}
          </h1>
          <p className="text-sm sm:text-base text-[#797979]">
            Let&apos;s organize your tasks!
          </p>
        </div>
      </div>

      {/* icon and filters */}
      <div className="my-2">
        {/* Mobile view - filters in dropdown menu */}
        <div className="block sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
                <span className="font-medium">Filters & Sort</span>
                <Filter className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-32px)]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleFilterStatus("completed")}
                  className={
                    filterStatus === "completed"
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : ""
                  }
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Completed</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterStatus("pending")}
                  className={
                    filterStatus === "pending"
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : ""
                  }
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  <span>Pending</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleFilterPriority("low")}
                  className={
                    filterPriority === "low"
                      ? "bg-green-100 text-green-700 font-medium"
                      : ""
                  }
                >
                  <span className="mr-2 h-4 w-4 text-green-500">●</span>
                  <span>Low</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterPriority("medium")}
                  className={
                    filterPriority === "medium"
                      ? "bg-yellow-100 text-yellow-700 font-medium"
                      : ""
                  }
                >
                  <span className="mr-2 h-4 w-4 text-yellow-500">●</span>
                  <span>Medium</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterPriority("high")}
                  className={
                    filterPriority === "high"
                      ? "bg-red-100 text-red-700 font-medium"
                      : ""
                  }
                >
                  <span className="mr-2 h-4 w-4 text-red-500">●</span>
                  <span>High</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleSort("newest")}
                  className={
                    sortOrder === "newest"
                      ? "bg-amber-100 text-amber-700 font-medium"
                      : ""
                  }
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span>Newest first</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSort("oldest")}
                  className={
                    sortOrder === "oldest"
                      ? "bg-amber-100 text-amber-700 font-medium"
                      : ""
                  }
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span>Oldest first</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {isAnyFilterActive && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={clearAllFilters}
                    className="bg-red-50 text-red-500 font-medium"
                  >
                    <X className="mr-2 h-4 w-4" />
                    <span>Clear all filters</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active filters display for mobile */}
          {isAnyFilterActive && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filterStatus && (
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center">
                  <span>
                    Status:{" "}
                    {filterStatus.charAt(0).toUpperCase() +
                      filterStatus.slice(1)}
                  </span>
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilterStatus(null)}
                  />
                </div>
              )}
              {filterPriority && (
                <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs flex items-center">
                  <span>
                    Priority:{" "}
                    {filterPriority.charAt(0).toUpperCase() +
                      filterPriority.slice(1)}
                  </span>
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilterPriority(null)}
                  />
                </div>
              )}
              {sortOrder && (
                <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs flex items-center">
                  <span>
                    Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
                  </span>
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setSortOrder(null)}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-2 flex justify-end">
            <Button
              className="bg-white"
              onClick={() => handleClick(TaskStatus.ToDo)}
            >
              Create new <CirclePlus />
            </Button>
          </div>
        </div>

        {/* Desktop view - horizontal filters */}
        <div className="hidden sm:flex items-center justify-end">
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 flex-wrap">
            {/* Status Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors ${
                    filterStatus
                      ? "bg-blue-500 text-white font-medium shadow-sm"
                      : "bg-[#F4F4F4] text-[#797979] hover:bg-gray-200"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-md">
                    Status
                    {filterStatus
                      ? `: ${
                          filterStatus.charAt(0).toUpperCase() +
                          filterStatus.slice(1)
                        }`
                      : ""}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleFilterStatus("completed")}
                    className={
                      filterStatus === "completed"
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : ""
                    }
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>Completed</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterStatus("pending")}
                    className={
                      filterStatus === "pending"
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : ""
                    }
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>Pending</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Priority Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors ${
                    filterPriority
                      ? "bg-purple-500 text-white font-medium shadow-sm"
                      : "bg-[#F4F4F4] text-[#797979] hover:bg-gray-200"
                  }`}
                >
                  <Filter />
                  <span className="text-md">
                    Priority
                    {filterPriority
                      ? `: ${
                          filterPriority.charAt(0).toUpperCase() +
                          filterPriority.slice(1)
                        }`
                      : ""}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleFilterPriority("low")}
                    className={
                      filterPriority === "low"
                        ? "bg-green-100 text-green-700 font-medium"
                        : ""
                    }
                  >
                    <span className="mr-2 h-4 w-4 text-green-500">●</span>
                    <span>Low</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterPriority("medium")}
                    className={
                      filterPriority === "medium"
                        ? "bg-yellow-100 text-yellow-700 font-medium"
                        : ""
                    }
                  >
                    <span className="mr-2 h-4 w-4 text-yellow-500">●</span>
                    <span>Medium</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterPriority("high")}
                    className={
                      filterPriority === "high"
                        ? "bg-red-100 text-red-700 font-medium"
                        : ""
                    }
                  >
                    <span className="mr-2 h-4 w-4 text-red-500">●</span>
                    <span>High</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors ${
                    sortOrder
                      ? "bg-amber-500 text-white font-medium shadow-sm"
                      : "bg-[#F4F4F4] text-[#797979] hover:bg-gray-200"
                  }`}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="text-md">
                    Sort
                    {sortOrder
                      ? `: ${sortOrder === "newest" ? "Newest" : "Oldest"}`
                      : ""}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleSort("newest")}
                    className={
                      sortOrder === "newest"
                        ? "bg-amber-100 text-amber-700 font-medium"
                        : ""
                    }
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <span>Newest first</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("oldest")}
                    className={
                      sortOrder === "oldest"
                        ? "bg-amber-100 text-amber-700 font-medium"
                        : ""
                    }
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <span>Oldest first</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button */}
            {isAnyFilterActive && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 text-white cursor-pointer bg-red-500 p-2 rounded-md hover:bg-red-600 transition-colors shadow-sm font-medium"
                aria-label="Clear all filters"
                type="button"
              >
                <X className="h-4 w-4" />
                <span className="text-md">Clear Filters</span>
              </button>
            )}

            <Button
              className="flex items-center justify-center gap-1 p-2 rounded-md dark:bg-black text-white"
              onClick={() => handleClick(TaskStatus.ToDo)}
            >
              Create new <CirclePlus />
            </Button>
          </div>
        </div>
      </div>

      {/* task board */}
      <div className="bg-white overflow-x-auto overflow-y-auto h-full w-full rounded-md mt-2">
        <Board
          filterStatus={filterStatus}
          filterPriority={filterPriority}
          sortOrder={sortOrder}
        />
      </div>
      <Sheet />
    </div>
  );
};

export default Page;
