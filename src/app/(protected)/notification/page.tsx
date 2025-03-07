"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Film,
  User,
  ThumbsUp,
  Check,
  Trash2,
  Filter,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    // Initialize with sample data
    setNotifications(sampleNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    // Filter by type
    if (activeTab !== "all") {
      filtered = filtered.filter((n) => n.type === activeTab);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const comparison = a.timestamp.getTime() - b.timestamp.getTime();
      return sortOrder === "newest" ? -comparison : comparison;
    });

    return filtered;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "new-content":
        return <Film className="h-5 w-5 text-red-500" />;
      case "account":
        return <User className="h-5 w-5 text-blue-500" />;
      case "recommendation":
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays < 1) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffInDays < 7) {
      return format(date, "EEEE 'at' h:mm a");
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm   p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">Notifications</h1>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-gray-400 hover:text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all as read
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Filter className="h-5 w-5" />
                  <span className="sr-only">Filter notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-900 border-gray-800"
              >
                <DropdownMenuItem
                  onClick={() => setSortOrder("newest")}
                  className={`${sortOrder === "newest" ? "bg-gray-800" : ""}`}
                >
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortOrder("oldest")}
                  className={`${sortOrder === "oldest" ? "bg-gray-800" : ""}`}
                >
                  Oldest first
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearAllNotifications}
              className="text-gray-400 hover:text-white"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear all notifications</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-4">
        {/* Tabs for filtering */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-red-600">
              All
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-red-600 text-white"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="new-content"
              className="data-[state=active]:bg-red-600"
            >
              New Content
            </TabsTrigger>
            <TabsTrigger
              value="recommendation"
              className="data-[state=active]:bg-red-600"
            >
              For You
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-red-600"
            >
              Account
            </TabsTrigger>
          </TabsList>

          {/* Notification list */}
          <TabsContent value={activeTab} className="mt-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-400">
                  No notifications
                </h3>
                <p className="text-gray-500 mt-2">
                  You&apos;re all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-200px)]">
                <ul className="space-y-4">
                  {getFilteredNotifications().map((notification) => (
                    <li
                      key={notification.id}
                      className={`
                        relative p-4 rounded-lg transition-all
                        ${
                          notification.read
                            ? "bg-gray-900/50 border border-gray-800"
                            : "bg-gray-800 border border-gray-700 shadow-md"
                        }
                      `}
                    >
                      <div className="flex gap-4">
                        {/* Image or icon */}
                        {notification.image ? (
                          <div className="flex-shrink-0">
                            <Image
                              src={notification.image || "/placeholder.svg"}
                              alt=""
                              className="w-20 h-30 object-cover rounded"
                              priority
                              fill
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-12 w-12 rounded bg-gray-800 flex items-center justify-center">
                            {getTypeIcon(notification.type)}
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`font-medium ${
                                !notification.read
                                  ? "text-white"
                                  : "text-gray-300"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p
                            className={`${
                              !notification.read
                                ? "text-gray-300"
                                : "text-gray-400"
                            }`}
                          >
                            {notification.description}
                          </p>

                          {/* Action buttons */}
                          <div className="mt-3 flex justify-end">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-gray-400 hover:text-white text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-600" />
                      )}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
