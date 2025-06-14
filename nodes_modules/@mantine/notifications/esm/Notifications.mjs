'use client';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useRef, useEffect } from 'react';
import { TransitionGroup, Transition as Transition$1 } from 'react-transition-group';
import { getDefaultZIndex, createVarsResolver, rem, factory, useProps, useMantineTheme, useStyles, OptionalPortal, Box, RemoveScroll } from '@mantine/core';
import { useForceUpdate, useReducedMotion, useDidUpdate } from '@mantine/hooks';
import { getGroupedNotifications, positions } from './get-grouped-notifications/get-grouped-notifications.mjs';
import { getNotificationStateStyles } from './get-notification-state-styles.mjs';
import { NotificationContainer } from './NotificationContainer.mjs';
import { notificationsStore, useNotifications, hideNotification, notifications } from './notifications.store.mjs';
import classes from './Notifications.module.css.mjs';

const Transition = Transition$1;
const defaultProps = {
  position: "bottom-right",
  autoClose: 4e3,
  transitionDuration: 250,
  containerWidth: 440,
  notificationMaxHeight: 200,
  limit: 5,
  zIndex: getDefaultZIndex("overlay"),
  store: notificationsStore,
  withinPortal: true
};
const varsResolver = createVarsResolver((_, { zIndex, containerWidth }) => ({
  root: {
    "--notifications-z-index": zIndex?.toString(),
    "--notifications-container-width": rem(containerWidth)
  }
}));
const Notifications = factory((_props, ref) => {
  const props = useProps("Notifications", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    position,
    autoClose,
    transitionDuration,
    containerWidth,
    notificationMaxHeight,
    limit,
    zIndex,
    store,
    portalProps,
    withinPortal,
    ...others
  } = props;
  const theme = useMantineTheme();
  const data = useNotifications(store);
  const forceUpdate = useForceUpdate();
  const shouldReduceMotion = useReducedMotion();
  const refs = useRef({});
  const previousLength = useRef(0);
  const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
  const duration = reduceMotion ? 1 : transitionDuration;
  const getStyles = useStyles({
    name: "Notifications",
    classes,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  useEffect(() => {
    store?.updateState((current) => ({
      ...current,
      limit: limit || 5,
      defaultPosition: position
    }));
  }, [limit, position]);
  useDidUpdate(() => {
    if (data.notifications.length > previousLength.current) {
      setTimeout(() => forceUpdate(), 0);
    }
    previousLength.current = data.notifications.length;
  }, [data.notifications]);
  const grouped = getGroupedNotifications(data.notifications, position);
  const groupedComponents = positions.reduce(
    (acc, pos) => {
      acc[pos] = grouped[pos].map(({ style: notificationStyle, ...notification }) => /* @__PURE__ */ jsx(
        Transition,
        {
          timeout: duration,
          onEnter: () => refs.current[notification.id].offsetHeight,
          nodeRef: { current: refs.current[notification.id] },
          children: (state) => /* @__PURE__ */ jsx(
            NotificationContainer,
            {
              ref: (node) => {
                if (node) {
                  refs.current[notification.id] = node;
                }
              },
              data: notification,
              onHide: (id) => hideNotification(id, store),
              autoClose,
              ...getStyles("notification", {
                style: {
                  ...getNotificationStateStyles({
                    state,
                    position: pos,
                    transitionDuration: duration,
                    maxHeight: notificationMaxHeight
                  }),
                  ...notificationStyle
                }
              })
            }
          )
        },
        notification.id
      ));
      return acc;
    },
    {}
  );
  return /* @__PURE__ */ jsxs(OptionalPortal, { withinPortal, ...portalProps, children: [
    /* @__PURE__ */ jsx(Box, { ...getStyles("root"), "data-position": "top-center", ref, ...others, children: /* @__PURE__ */ jsx(TransitionGroup, { children: groupedComponents["top-center"] }) }),
    /* @__PURE__ */ jsx(Box, { ...getStyles("root"), "data-position": "top-left", ...others, children: /* @__PURE__ */ jsx(TransitionGroup, { children: groupedComponents["top-left"] }) }),
    /* @__PURE__ */ jsx(
      Box,
      {
        ...getStyles("root", { className: RemoveScroll.classNames.fullWidth }),
        "data-position": "top-right",
        ...others,
        children: /* @__PURE__ */ jsx(TransitionGroup, { children: groupedComponents["top-right"] })
      }
    ),
    /* @__PURE__ */ jsx(
      Box,
      {
        ...getStyles("root", { className: RemoveScroll.classNames.fullWidth }),
        "data-position": "bottom-right",
        ...others,
        children: /* @__PURE__ */ jsx(TransitionGroup, { children: groupedComponents["bottom-right"] })
      }
    ),
    /* @__PURE__ */ jsx(Box, { ...getStyles("root"), "data-position": "bottom-left", ...others, children: /* @__PURE__ */ jsx(TransitionGroup, { children: groupedComponents["bottom-left"] }) }),
    /* @__PURE__ */ jsx(Box, { ...getStyles("root"), "data-position": "bottom-center", ...others, children: /* @__PURE__ */ jsx(TransitionGroup, { children: groupedComponents["bottom-center"] }) })
  ] });
});
Notifications.classes = classes;
Notifications.displayName = "@mantine/notifications/Notifications";
Notifications.show = notifications.show;
Notifications.hide = notifications.hide;
Notifications.update = notifications.update;
Notifications.clean = notifications.clean;
Notifications.cleanQueue = notifications.cleanQueue;
Notifications.updateState = notifications.updateState;

export { Notifications };
//# sourceMappingURL=Notifications.mjs.map
