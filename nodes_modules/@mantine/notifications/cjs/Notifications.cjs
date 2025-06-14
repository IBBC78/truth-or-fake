'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var reactTransitionGroup = require('react-transition-group');
var core = require('@mantine/core');
var hooks = require('@mantine/hooks');
var getGroupedNotifications = require('./get-grouped-notifications/get-grouped-notifications.cjs');
var getNotificationStateStyles = require('./get-notification-state-styles.cjs');
var NotificationContainer = require('./NotificationContainer.cjs');
var notifications_store = require('./notifications.store.cjs');
var Notifications_module = require('./Notifications.module.css.cjs');

const Transition = reactTransitionGroup.Transition;
const defaultProps = {
  position: "bottom-right",
  autoClose: 4e3,
  transitionDuration: 250,
  containerWidth: 440,
  notificationMaxHeight: 200,
  limit: 5,
  zIndex: core.getDefaultZIndex("overlay"),
  store: notifications_store.notificationsStore,
  withinPortal: true
};
const varsResolver = core.createVarsResolver((_, { zIndex, containerWidth }) => ({
  root: {
    "--notifications-z-index": zIndex?.toString(),
    "--notifications-container-width": core.rem(containerWidth)
  }
}));
const Notifications = core.factory((_props, ref) => {
  const props = core.useProps("Notifications", defaultProps, _props);
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
  const theme = core.useMantineTheme();
  const data = notifications_store.useNotifications(store);
  const forceUpdate = hooks.useForceUpdate();
  const shouldReduceMotion = hooks.useReducedMotion();
  const refs = react.useRef({});
  const previousLength = react.useRef(0);
  const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
  const duration = reduceMotion ? 1 : transitionDuration;
  const getStyles = core.useStyles({
    name: "Notifications",
    classes: Notifications_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  react.useEffect(() => {
    store?.updateState((current) => ({
      ...current,
      limit: limit || 5,
      defaultPosition: position
    }));
  }, [limit, position]);
  hooks.useDidUpdate(() => {
    if (data.notifications.length > previousLength.current) {
      setTimeout(() => forceUpdate(), 0);
    }
    previousLength.current = data.notifications.length;
  }, [data.notifications]);
  const grouped = getGroupedNotifications.getGroupedNotifications(data.notifications, position);
  const groupedComponents = getGroupedNotifications.positions.reduce(
    (acc, pos) => {
      acc[pos] = grouped[pos].map(({ style: notificationStyle, ...notification }) => /* @__PURE__ */ jsxRuntime.jsx(
        Transition,
        {
          timeout: duration,
          onEnter: () => refs.current[notification.id].offsetHeight,
          nodeRef: { current: refs.current[notification.id] },
          children: (state) => /* @__PURE__ */ jsxRuntime.jsx(
            NotificationContainer.NotificationContainer,
            {
              ref: (node) => {
                if (node) {
                  refs.current[notification.id] = node;
                }
              },
              data: notification,
              onHide: (id) => notifications_store.hideNotification(id, store),
              autoClose,
              ...getStyles("notification", {
                style: {
                  ...getNotificationStateStyles.getNotificationStateStyles({
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
  return /* @__PURE__ */ jsxRuntime.jsxs(core.OptionalPortal, { withinPortal, ...portalProps, children: [
    /* @__PURE__ */ jsxRuntime.jsx(core.Box, { ...getStyles("root"), "data-position": "top-center", ref, ...others, children: /* @__PURE__ */ jsxRuntime.jsx(reactTransitionGroup.TransitionGroup, { children: groupedComponents["top-center"] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(core.Box, { ...getStyles("root"), "data-position": "top-left", ...others, children: /* @__PURE__ */ jsxRuntime.jsx(reactTransitionGroup.TransitionGroup, { children: groupedComponents["top-left"] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      core.Box,
      {
        ...getStyles("root", { className: core.RemoveScroll.classNames.fullWidth }),
        "data-position": "top-right",
        ...others,
        children: /* @__PURE__ */ jsxRuntime.jsx(reactTransitionGroup.TransitionGroup, { children: groupedComponents["top-right"] })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      core.Box,
      {
        ...getStyles("root", { className: core.RemoveScroll.classNames.fullWidth }),
        "data-position": "bottom-right",
        ...others,
        children: /* @__PURE__ */ jsxRuntime.jsx(reactTransitionGroup.TransitionGroup, { children: groupedComponents["bottom-right"] })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(core.Box, { ...getStyles("root"), "data-position": "bottom-left", ...others, children: /* @__PURE__ */ jsxRuntime.jsx(reactTransitionGroup.TransitionGroup, { children: groupedComponents["bottom-left"] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(core.Box, { ...getStyles("root"), "data-position": "bottom-center", ...others, children: /* @__PURE__ */ jsxRuntime.jsx(reactTransitionGroup.TransitionGroup, { children: groupedComponents["bottom-center"] }) })
  ] });
});
Notifications.classes = Notifications_module;
Notifications.displayName = "@mantine/notifications/Notifications";
Notifications.show = notifications_store.notifications.show;
Notifications.hide = notifications_store.notifications.hide;
Notifications.update = notifications_store.notifications.update;
Notifications.clean = notifications_store.notifications.clean;
Notifications.cleanQueue = notifications_store.notifications.cleanQueue;
Notifications.updateState = notifications_store.notifications.updateState;

exports.Notifications = Notifications;
//# sourceMappingURL=Notifications.cjs.map
