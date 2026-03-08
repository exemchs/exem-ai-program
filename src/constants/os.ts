export type OsType = "mac" | "win";

export const OS_KEYS = {
  mac: {
    mod: "⌘",
    alt: "⌥",
    openTerminal: "⌘+J",
    quit: "⌘+Q",
    shellReload: "source ~/.zshrc",
    osLabel: "macOS",
  },
  win: {
    mod: "Ctrl",
    alt: "Alt",
    openTerminal: "Ctrl+J",
    quit: "Alt+F4",
    shellReload: "source ~/.bashrc",
    osLabel: "Windows",
  },
} as const;
