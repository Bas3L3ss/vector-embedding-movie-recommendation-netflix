import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Play, Settings, ThumbsUp } from "lucide-react";
import { Notification, NotificationType } from "./notification-button";

// Icon mapping for different notification types
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "new-content":
      return <Play className="h-5 w-5 text-[#E50914]" />;
    case "account":
      return <Settings className="h-5 w-5 text-gray-400" />;
    case "recommendation":
      return <ThumbsUp className="h-5 w-5 text-[#46d369]" />;
    default:
      return null;
  }
};

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  // Format the timestamp to a relative time (e.g., "5 minutes ago")
  const formattedTime = formatDistanceToNow(notification.timestamp, {
    addSuffix: true,
  });

  return (
    <div
      className={cn(
        "p-4 hover:bg-gray-900 transition-colors flex gap-3",
        !notification.read && "bg-gray-900/50"
      )}
    >
      {notification.image ? (
        <div className="flex-shrink-0">
          <Image
            src={notification.image || "/placeholder.svg"}
            alt={notification.title}
            width={60}
            height={90}
            className="rounded object-cover"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
          <NotificationIcon type={notification.type} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">
          {notification.title}
        </h4>
        <p className="text-sm text-gray-400 mt-1">{notification.description}</p>
        <p className="text-xs text-gray-500 mt-2">{formattedTime}</p>
      </div>

      {!notification.read && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#E50914]"></div>
        </div>
      )}
    </div>
  );
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
