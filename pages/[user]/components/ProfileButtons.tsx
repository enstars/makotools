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
import useTranslation from "next-translate/useTranslation";

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
  openEditModal,
}: {
  user: User;
  uid: string;
  profile: UserData;
  isFriend: boolean;
  isIncomingReq: boolean;
  isOutgoingReq: boolean;
  setOpenEditModal: Dispatch<SetStateAction<boolean>>;
  setRemoveFriendModal: Dispatch<SetStateAction<boolean>>;
  openEditModal: () => void;
}) {
  const { t } = useTranslation("user");
  const theme = useMantineTheme();

  const shareURL = `enstars.link/@${profile.username}`;
  const shareURLFull = `https://enstars.link/@${profile.username}`;
  return (
    <Group spacing="xs">
      {user.loggedIn && user.db.suid === profile.suid && (
        <Tooltip label={t("editProfile")}>
          <ActionIcon
            onClick={openEditModal}
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
          <Tooltip label={t("copyUrl")}>
            <ActionIcon
              onClick={() => {
                copy();
                notify("info", {
                  icon: <IconCopy size={16} />,
                  message: t("linkCopied"),
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
            <Tooltip label={t("sendFriendReq")}>
              <ActionIcon
                onClick={async () => {
                  showNotification({
                    id: "friendReq",
                    loading: true,
                    message: t("processingRequest"),
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
            <Tooltip label={t("removeFriend")}>
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
                <Tooltip label={t("sentFriendReq", { friend: profile.name })}>
                  <Indicator>
                    <ActionIcon size="lg" variant="light">
                      <IconUserExclamation size={18} />
                    </ActionIcon>
                  </Indicator>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{t("friendReqOptions")}</Menu.Label>
                <Menu.Item
                  icon={<IconCheck size={14} />}
                  px={5}
                  onClick={async () => {
                    showNotification({
                      id: "addFriend",
                      loading: true,
                      message: t("processingRequest"),
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
                        message: t("friendAdded", {
                          friend: profile.name || profile.username,
                        }),
                      });
                    } else {
                      updateNotification({
                        id: "addFriend",
                        loading: false,
                        color: "red",
                        icon: <IconX size={24} />,
                        message: t("addError"),
                      });
                    }
                  }}
                >
                  {t("acceptFriendReq")}
                </Menu.Item>
                <Menu.Item
                  color="red"
                  icon={<IconX size={14} />}
                  px={5}
                  onClick={async () => {
                    showNotification({
                      id: "removeReq",
                      loading: true,
                      message: t("processingRequest"),
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
                        message: t("deleteFriendReq"),
                      });
                    } else {
                      updateNotification({
                        id: "removeReq",
                        loading: false,
                        color: "red",
                        icon: <IconX size={24} />,
                        message: t("deleteReqError"),
                      });
                    }
                  }}
                >
                  <Text size="sm">{t("declineFriendReq")}</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {!isFriend && isOutgoingReq && (
            <Menu width={200} position="top">
              <Menu.Target>
                <Tooltip label={t("pendingFriendReq")}>
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
                      message: t("processingReq"),
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
                        message: t("friendReqCancelled"),
                      });
                    } else {
                      updateNotification({
                        id: "cancelReq",
                        loading: false,
                        color: "red",
                        icon: <IconX size={24} />,
                        message: t("cancelError"),
                      });
                    }
                  }}
                >
                  <Text size="sm">Cancel friend request</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          <Tooltip label={t("reportProfile")}>
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
