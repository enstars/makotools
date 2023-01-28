import {
  ActionIcon,
  CopyButton,
  Group,
  Indicator,
  Menu,
  Tooltip,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconPencil,
  IconCopy,
  IconLink,
  IconCheck,
  IconX,
  IconUserPlus,
  IconUserX,
  IconUserExclamation,
  IconArrowsUpDown,
  IconFlag,
} from "@tabler/icons-react";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

import { CONSTANTS } from "services/makotools/constants";
import notify from "services/libraries/notify";
import { User, UserData } from "types/makotools";

/** Friend, edit profile, and sharable link buttons
 * @param {User} user - The logged-in user object
 * @param {string} uid - The current profile's user ID
 * @param {UserData} profile - The current profile
 * @param {boolean} isFriend - Is the current logged-in user friends with the profile user?
 * @param {boolean} isIncomingReq - Did the profile user send a friend req to the currently logged-in user?
 * @param {Dispatch<SetStateAction<boolean>>} setOpenEditModal - The function that controls the edit profile modal
 * @param {Dispatch<SetStateAction<boolean>>} setRemoveFriendModal - The function that controls the remove friend modal
 */
function ProfileButtons({
  user,
  uid,
  profile,
  isFriend,
  isIncomingReq,
  isOutgoingReq,
  setOpenEditModal,
  setRemoveFriendModal,
}: {
  user: User;
  uid: string;
  profile: UserData;
  isFriend: boolean;
  isIncomingReq: boolean;
  isOutgoingReq: boolean;
  setOpenEditModal: Dispatch<SetStateAction<boolean>>;
  setRemoveFriendModal: Dispatch<SetStateAction<boolean>>;
}) {
  const theme = useMantineTheme();

  const shareURL = `enstars.link/@${profile.username}`;
  const shareURLFull = `https://enstars.link/@${profile.username}`;
  return (
    <Group spacing="xs">
      {user.loggedIn && user.db.suid === profile.suid && (
        <Tooltip label="Edit profile">
          <ActionIcon
            onClick={() => {
              setOpenEditModal(true);
            }}
            size="lg"
            color="green"
            variant="light"
          >
            <IconPencil size={18} />
          </ActionIcon>
        </Tooltip>
      )}
      <CopyButton value={shareURLFull}>
        {({ copy }) => (
          <Tooltip label="Copy sharable URL">
            <ActionIcon
              onClick={() => {
                copy();
                notify("info", {
                  icon: <IconCopy size={16} />,
                  message: "Profile link copied",
                  title: (
                    <>
                      <Text span>
                        <Text span weight={400}>
                          https://
                        </Text>
                        <Text span weight={700}>
                          {shareURL}
                        </Text>
                      </Text>
                    </>
                  ),
                });
              }}
              size="lg"
              color={theme.primaryColor}
              variant="light"
            >
              <IconLink size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
      {user.loggedIn && user.db.suid !== profile.suid && (
        <>
          {!isFriend && !isOutgoingReq && !isIncomingReq && (
            <Tooltip label="Send friend request">
              <ActionIcon
                onClick={async () => {
                  showNotification({
                    id: "friendReq",
                    loading: true,
                    message: "Processing your request...",
                    disallowClose: true,
                    autoClose: false,
                  });
                  const token = await user.user.getIdToken();
                  const res = await fetch("/api/friendRequest/add", {
                    method: "POST",
                    headers: {
                      Authorization: token || "",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ friend: uid }),
                  });

                  const status = await res.json();
                  if (status?.success) {
                    updateNotification({
                      id: "friendReq",
                      loading: false,
                      color: "lime",
                      icon: <IconCheck size={24} />,
                      message: "Your friend request was sent successfully!",
                    });
                  } else {
                    updateNotification({
                      id: "friendReq",
                      loading: false,
                      color: "red",
                      icon: <IconX size={24} />,
                      title: "An error occured:",
                      message: "Your friend request could not be processed.",
                    });
                  }
                }}
                size="lg"
                color="green"
                variant="light"
              >
                <IconUserPlus size={18} />
              </ActionIcon>
            </Tooltip>
          )}
          {isFriend && (
            <Tooltip label="Remove friend">
              <ActionIcon
                size="lg"
                color="red"
                variant="light"
                onClick={() => setRemoveFriendModal(true)}
              >
                <IconUserX size={18} />
              </ActionIcon>
            </Tooltip>
          )}
          {!isFriend && isIncomingReq && (
            <Menu width={200} position="top">
              <Menu.Target>
                <Tooltip label={`${profile.name} sent you a friend request`}>
                  <Indicator>
                    <ActionIcon size="lg" variant="light">
                      <IconUserExclamation size={18} />
                    </ActionIcon>
                  </Indicator>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Friend request options</Menu.Label>
                <Menu.Item
                  icon={<IconCheck size={14} />}
                  px={5}
                  onClick={async () => {
                    showNotification({
                      id: "addFriend",
                      loading: true,
                      message: "Processing your request...",
                      disallowClose: true,
                      autoClose: false,
                    });
                    const token = await user.user.getIdToken();
                    const res = await fetch("/api/friend/add", {
                      method: "POST",
                      headers: {
                        Authorization: token || "",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ friend: uid }),
                    });
                    const status = await res.json();
                    if (status?.success) {
                      user.privateDb.set({
                        friends__receivedRequests: arrayRemove(uid),
                        friends__list: arrayUnion(uid),
                      });
                      updateNotification({
                        id: "addFriend",
                        loading: false,
                        color: "lime",
                        icon: <IconCheck size={24} />,
                        message: `${
                          profile.name || profile.username
                        } is now your friend!`,
                      });
                    } else {
                      updateNotification({
                        id: "addFriend",
                        loading: false,
                        color: "red",
                        icon: <IconX size={24} />,
                        message:
                          "There was an error updating your friends list",
                      });
                    }
                  }}
                >
                  Accept friend request
                </Menu.Item>
                <Menu.Item
                  color="red"
                  icon={<IconX size={14} />}
                  px={5}
                  onClick={async () => {
                    showNotification({
                      id: "removeReq",
                      loading: true,
                      message: "Processing your request...",
                      disallowClose: true,
                      autoClose: false,
                    });
                    const token = await user.user.getIdToken();
                    const res = await fetch("/api/friendRequest/delete", {
                      method: "POST",
                      headers: {
                        Authorization: token || "",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ friend: uid }),
                    });
                    const status = await res.json();
                    if (status?.success) {
                      user.privateDb.set({
                        friends__receivedRequests: arrayRemove(uid),
                      });
                      updateNotification({
                        id: "removeReq",
                        loading: false,
                        color: "lime",
                        icon: <IconCheck size={24} />,
                        message: "This friend request has been deleted",
                      });
                    } else {
                      updateNotification({
                        id: "removeReq",
                        loading: false,
                        color: "red",
                        icon: <IconX size={24} />,
                        message: "There was an error removing this request",
                      });
                    }
                  }}
                >
                  <Text size="sm">Decline friend request</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {!isFriend && isOutgoingReq && (
            <Menu width={200} position="top">
              <Menu.Target>
                <Tooltip label="Pending friend request">
                  <ActionIcon size="lg" variant="light">
                    <IconArrowsUpDown size={18} />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  icon={<IconX size={14} />}
                  py={2}
                  px={5}
                  onClick={async () => {
                    showNotification({
                      id: "cancelReq",
                      loading: true,
                      message: "Processing your request...",
                      disallowClose: true,
                      autoClose: false,
                    });
                    const token = await user.user.getIdToken();
                    const res = await fetch("/api/friendRequest/cancel", {
                      method: "POST",
                      headers: {
                        Authorization: token || "",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ friend: uid }),
                    });
                    const status = await res.json();
                    if (status?.success) {
                      user.privateDb.set({
                        friends__sentRequests: arrayRemove(uid),
                      });
                      updateNotification({
                        id: "cancelReq",
                        loading: false,
                        color: "lime",
                        icon: <IconCheck size={24} />,
                        message: `Your friend request has been cancelled`,
                      });
                    } else {
                      updateNotification({
                        id: "cancelReq",
                        loading: false,
                        color: "red",
                        icon: <IconX size={24} />,
                        message:
                          "There was an error cancelling your friend request",
                      });
                    }
                  }}
                >
                  <Text size="sm">Cancel friend request</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          <Tooltip label="Report profile">
            <ActionIcon
              component={Link}
              href={CONSTANTS.MODERATION.GET_REPORT_LINK(
                profile.username,
                profile.suid
              )}
              target="_blank"
              size="lg"
              color="orange"
              variant="light"
            >
              <IconFlag size={18} />
            </ActionIcon>
          </Tooltip>
        </>
      )}
    </Group>
  );
}

export default ProfileButtons;
