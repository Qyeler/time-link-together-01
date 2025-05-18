
import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarSize, setSidebarSize] = React.useState(20); // Default sidebar size as percentage

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel 
            defaultSize={sidebarSize}
            minSize={15}
            maxSize={30}
            onResize={(size) => setSidebarSize(size)}
            className="max-w-[300px]"
          >
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={100 - sidebarSize}>
            <main className="h-full overflow-auto p-4 bg-secondary/20">{children}</main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
