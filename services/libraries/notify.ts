import { NotificationProps, showNotification } from "@mantine/notifications";

export default function notify(type: any, props: NotificationProps) {
  showNotification(props);
}
