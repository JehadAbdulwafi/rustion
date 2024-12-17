import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import * as QuickActions from "expo-quick-actions";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

export function useQuickActionCallback(
  callback?: (data: QuickActions.Action) => void | Promise<void>,
) {
  useEffect(() => {
    let isMounted = true;

    if (QuickActions.initial) {
      void callback?.(QuickActions.initial);
    }

    const sub = QuickActions.addListener((event) => {
      if (isMounted) {
        void callback?.(event);
      }
    });
    return () => {
      isMounted = false;
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QuickActions.initial, callback]);
}

export function useQuickAction() {
  const [action, setAction] = useState<QuickActions.Action | null>(
    QuickActions.initial ?? null,
  );

  useEffect(() => {
    let isMounted = true;

    const actionSub = QuickActions.addListener((event) => {
      if (isMounted) {
        setAction(event);
      }
    });
    const appStateSub = AppState.addEventListener("change", (state) => {
      if (isMounted && state !== "active") {
        setAction(null);
      }
    });

    return () => {
      isMounted = false;
      actionSub.remove();
      appStateSub.remove();
    };
  }, []);

  return action;
}

export function useSetupQuickActions() {
  const { _ } = useLingui();

  useEffect(() => {
    // use static quick actions on iOS
    if (Platform.OS === "ios") return;
    void QuickActions.isSupported().then((supported) => {
      if (supported) {
        void QuickActions.setItems([
          {
            id: "search",
            title: _(msg`Search`),
            params: { href: "/tabs/explore" },
            icon: "shortcut_search",
          },
          {
            id: "live",
            title: _(msg`Live`),
            params: { href: "/tabs/live" },
            icon: "shortcut_compose",
          },
          {
            id: "settings",
            title: _(msg`Settings`),
            params: { href: "/tabs/account" },
            icon: "shortcut_settings",
          },
        ]);
      }
    });
  }, [_]);
}
