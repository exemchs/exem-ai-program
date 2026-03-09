export type OsType = "mac" | "win" | "linux";

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
  linux: {
    mod: "Ctrl",
    alt: "Alt",
    openTerminal: "Ctrl+`",
    quit: "Ctrl+Q",
    shellReload: "source ~/.bashrc",
    osLabel: "Linux",
  },
} as const;
