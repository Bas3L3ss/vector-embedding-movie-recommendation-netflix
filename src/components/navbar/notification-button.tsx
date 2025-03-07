"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationItem from "./notification-item";

// Types for our notifications
export type NotificationType = "new-content" | "account" | "recommendation";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  image?: string;
  read: boolean;
}

// Sample notification data
const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "new-content",
    title: "New Arrival",
    description: "Season 2 of 'Cosmic Frontiers' is now available",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    image: "/placeholder.svg?height=120&width=80&text=Cosmic+Frontiers",
    read: false,
  },
  {
    id: "2",
    type: "recommendation",
    title: "Recommended for You",
    description:
      "Based on your watching history, you might enjoy 'Midnight Chronicles'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    image: "/placeholder.svg?height=120&width=80&text=Midnight+Chronicles",
    read: false,
  },
  {
    id: "3",
    type: "account",
    title: "Profile Update",
    description: "Your profile settings have been updated successfully",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: "4",
    type: "new-content",
    title: "New Release",
    description: "'Kingdom's Edge' has just been added to Netflix",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    image: "/placeholder.svg?height=120&width=80&text=Kingdom's+Edge",
    read: true,
  },
  {
    id: "5",
    type: "recommendation",
    title: "Top Pick for You",
    description: "Don't miss 'Urban Legends' - trending now",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    image: "/placeholder.svg?height=120&width=80&text=Urban+Legends",
    read: true,
  },
  {
    id: "6",
    type: "account",
    title: "Payment Processed",
    description: "Your monthly subscription has been renewed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    read: true,
  },
  {
    id: "7",
    type: "new-content",
    title: "Coming Soon",
    description: "'The Last Stand' premieres next week. Add it to your list!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    image: "/placeholder.svg?height=120&width=80&text=The+Last+Stand",
    read: true,
  },
  {
    id: "8",
    type: "recommendation",
    title: "Because You Watched",
    description:
      "If you liked 'Cosmic Frontiers', check out 'Medical Frontline'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    image: "/placeholder.svg?height=120&width=80&text=Medical+Frontline",
    read: true,
  },
];

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(sampleNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mark all as read when opening dropdown
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);

    if (!isOpen && unreadCount > 0) {
      // Mark all as read
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-black text-white hover:text-gray-300 transition"
        onClick={handleToggleDropdown}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#E50914] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#141414] border border-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
          </div>

          <div className="max-h-[70vh] overflow-y-auto netflix-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                <p>No notifications yet</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-800 text-center">
            <button className="text-sm text-gray-400 hover:text-white transition">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
