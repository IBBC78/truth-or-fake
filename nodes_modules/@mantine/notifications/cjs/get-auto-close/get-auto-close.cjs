'use client';
'use strict';

function getAutoClose(autoClose, notificationAutoClose) {
  if (typeof notificationAutoClose === "number") {
    return notificationAutoClose;
  }
  if (notificationAutoClose === false || autoClose === false) {
    return false;
  }
  return autoClose;
}

exports.getAutoClose = getAutoClose;
//# sourceMappingURL=get-auto-close.cjs.map
