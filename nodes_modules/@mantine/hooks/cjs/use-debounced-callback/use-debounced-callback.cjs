'use client';
'use strict';

var React = require('react');
var useCallbackRef = require('../utils/use-callback-ref/use-callback-ref.cjs');

function useDebouncedCallback(callback, options) {
  const delay = typeof options === "number" ? options : options.delay;
  const flushOnUnmount = typeof options === "number" ? false : options.flushOnUnmount;
  const leading = typeof options === "number" ? false : options.leading;
  const handleCallback = useCallbackRef.useCallbackRef(callback);
  const debounceTimerRef = React.useRef(0);
  const flushRef = React.useRef(() => {
  });
  const leadingRef = React.useRef(leading);
  const lastCallback = Object.assign(
    React.useCallback(
      (...args) => {
        window.clearTimeout(debounceTimerRef.current);
        if (leading && leadingRef.current) {
          leadingRef.current = false;
          handleCallback(...args);
          return;
        }
        const flush = () => {
          if (debounceTimerRef.current !== 0) {
            debounceTimerRef.current = 0;
            leadingRef.current = true;
            handleCallback(...args);
          }
        };
        flushRef.current = flush;
        lastCallback.flush = flush;
        debounceTimerRef.current = window.setTimeout(flush, delay);
        leadingRef.current = false;
      },
      [handleCallback, delay, leading]
    ),
    { flush: flushRef.current }
  );
  React.useEffect(
    () => () => {
      window.clearTimeout(debounceTimerRef.current);
      if (flushOnUnmount) {
        lastCallback.flush();
      }
    },
    [lastCallback, flushOnUnmount]
  );
  return lastCallback;
}

exports.useDebouncedCallback = useDebouncedCallback;
//# sourceMappingURL=use-debounced-callback.cjs.map
