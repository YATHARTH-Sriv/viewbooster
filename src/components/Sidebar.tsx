import React from 'react';
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Home, BarChart2, Settings as SettingsIcon, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  setActiveComponent,
  activeComponent, 
}) => {
  const { data: session } = useSession();

  const isGuest = session?.user?.isGuest; // Assuming the guest info is stored here

  return (
    <div className={cn(
      "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between p-4">
        <h1 className={cn("text-xl font-bold", !isOpen && "hidden")}>Dashboard</h1>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 px-2">
          <li>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start",
                activeComponent === "home" && "bg-gray-800"
              )}
              onClick={() => setActiveComponent("home")}
            >
              <Home className="mr-2 h-4 w-4" />
              {isOpen && "Home"}
            </Button>
          </li>
          <li>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start",
                activeComponent === "analytics" && "bg-gray-800"
              )}
              onClick={() => setActiveComponent("analytics")}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              {isOpen && "Analytics"}
            </Button>
          </li>
          {/* Show Settings only for non-guest users */}
          {!isGuest && (
            <li>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start",
                  activeComponent === "settings" && "bg-gray-800"
                )}
                onClick={() => setActiveComponent("settings")}
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                {isOpen && "Settings"}
              </Button>
            </li>
          )}
        </ul>
      </nav>

      {/* User profile section remains the same */}
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {session?.user?.image && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={session.user.image}
                alt={session?.user?.name || "User"}
                className="object-cover"
                fill
                sizes="40px"
              />
            </div>
          )}
          {isOpen && (
            <div className="flex-1">
              <p className="font-medium">{session?.user?.name}</p>
              {/* Show sign-out button only for non-guest users */}
              {!isGuest && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 m-1 h-auto text-gray-400 hover:text-black hover:bg-white"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <p className="p-2">Sign out</p>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
