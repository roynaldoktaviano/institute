"use client";

import { useState } from "react";
import { AuthProvider } from "@/lib/auth";
import BlockInspect from "@/components/BlockInspect";
import Sidebar from "./Sidebar";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <Sidebar
          user={{ name: "Susi Programmer", avatar_urls: undefined }}
         
          handleLogout={() => console.log("Logout")}
          onCollapseChange={setIsCollapsed}
        />

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 m-0 ${
            isCollapsed ? "ml-0" : "ml-[16rem]"
          }`}
        >
          <main className="flex-1 overflow-y-auto">
            <BlockInspect />
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
