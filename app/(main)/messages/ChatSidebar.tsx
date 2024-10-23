import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { useSession } from "../SessionProvider";
import { Button } from "@/components/ui/button";
import { MailPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import NewChatDialog from "./NewChatDialog";
import { useQueryClient } from "@tanstack/react-query";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const { user } = useSession();

  const queryClient = useQueryClient();

  const { channel } = useChatContext();

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
    }
  }, [channel?.id, queryClient]);

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );
  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: {
            $in: [user?.id],
          },
        }}
        // This limit:8 shows only 8 users and if we want morethan 8 people we just need to click on show more.
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        // This is used to search for channels. In order to search for other users, we need to open the messages page of the user.
        // This helps us in creating a user in the stream chat database.
        showChannelSearch
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: {
                  $in: [user?.id],
                },
              },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
}

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          size="icon"
          variant="ghost"
          title="Start new chat"
          onClick={() => {
            setShowNewChatDialog(true);
          }}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
