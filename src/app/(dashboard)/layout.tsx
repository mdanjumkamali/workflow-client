import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-full">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] border">
        <Sidebar />
      </div>
      <main className="md:pl-72">{children}</main>
    </div>
  );
};

export default DashboardLayout;
