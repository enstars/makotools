import { NotificationProps, showNotification } from "@mantine/notifications";

export default function notify(type: any, props: NotificationProps) {
  return showNotification({
    ...props,
    styles: (theme) => ({
      root: {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[1],
      },
      title: {
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[0]
            : theme.colors.gray[9],
      },
      description: {
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[0]
            : theme.colors.gray[9],
      },
    }),
  });
}
