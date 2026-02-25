"""
File Cleanup Utility
====================
Finds files unused for more than 5 months and lets the user review them before deleting.
"""

import os
import sys
import time
import stat
import struct
import threading
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from datetime import datetime, timedelta
from pathlib import Path

# ── Constants ──────────────────────────────────────────────────────────────────
MONTHS_THRESHOLD = 5
DAYS_THRESHOLD   = MONTHS_THRESHOLD * 30

JUNK_EXTENSIONS = {
    ".tmp", ".temp", ".log", ".bak", ".old", ".chk", ".dmp", ".dump",
    ".~", ".swp", ".swo", ".DS_Store", ".Thumbs.db", ".thumbdata",
    ".crdownload", ".part", ".partial", ".cache",
}

KNOWN_SIGNATURES: dict[str, bytes] = {
    ".jpg":  b"\xff\xd8\xff",
    ".jpeg": b"\xff\xd8\xff",
    ".png":  b"\x89PNG",
    ".pdf":  b"%PDF",
    ".zip":  b"PK\x03\x04",
    ".gif":  b"GIF8",
    ".bmp":  b"BM",
    ".mp3":  b"ID3",
    ".mp4":  b"\x00\x00\x00",
    ".docx": b"PK\x03\x04",
    ".xlsx": b"PK\x03\x04",
    ".pptx": b"PK\x03\x04",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def file_age_days(path: Path) -> float:
    try:
        st = path.stat()
        last_used = max(st.st_atime, st.st_mtime)
        return (time.time() - last_used) / 86400
    except Exception:
        return 0.0

def is_empty(path: Path) -> bool:
    try:
        return path.stat().st_size == 0
    except Exception:
        return False

def is_corrupted(path: Path) -> bool:
    ext = path.suffix.lower()
    if ext not in KNOWN_SIGNATURES:
        return False
    expected = KNOWN_SIGNATURES[ext]
    try:
        with open(path, "rb") as f:
            header = f.read(len(expected))
        return header != expected
    except (PermissionError, OSError):
        return False

def is_junk(path: Path) -> bool:
    return path.suffix.lower() in JUNK_EXTENSIONS

def human_size(size_bytes: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"

def human_age(days: float) -> str:
    if days < 1:
        return "< 1 day"
    months = int(days // 30)
    rem_days = int(days % 30)
    if months:
        return f"{months}mo {rem_days}d"
    return f"{int(days)}d"


# ── Main App ──────────────────────────────────────────────────────────────────

class FileCleanerApp(tk.Tk):
    # Dark-mode colour palette
    BG        = "#1e1e2e"
    PANEL     = "#2a2a3e"
    ACCENT    = "#7c3aed"
    ACCENT2   = "#06b6d4"
    DANGER    = "#ef4444"
    WARNING   = "#f59e0b"
    SUCCESS   = "#22c55e"
    TXT       = "#e2e8f0"
    TXT_DIM   = "#94a3b8"
    BORDER    = "#374151"

    def __init__(self):
        super().__init__()
        self.title("🧹 File Cleanup Utility")
        self.geometry("1080x720")
        self.minsize(800, 560)
        self.configure(bg=self.BG)
        self.resizable(True, True)

        self.scan_dir     = tk.StringVar()
        self.status_text  = tk.StringVar(value="Choose a folder and click Scan.")
        self.results: list[dict] = []
        self._scan_thread = None
        self._stop_scan   = False
        self._selected_items: set[str] = set()

        self._build_styles()

    def _build_styles(self):
        s = ttk.Style(self)
        s.theme_use("clam")
        s.configure("Treeview",
                     background=self.PANEL, fieldbackground=self.PANEL,
                     foreground=self.TXT, rowheight=28, borderwidth=0,
                     font=("Segoe UI", 10))
        s.configure("Treeview.Heading",
                     background=self.ACCENT, foreground="white",
                     font=("Segoe UI Semibold", 10), relief="flat")
        s.map("Treeview",
              background=[("selected", self.ACCENT)],
              foreground=[("selected", "white")])
        s.configure("Vertical.TScrollbar",
                     troughcolor=self.PANEL, background=self.ACCENT,
                     borderwidth=0, arrowsize=14)
        s.configure("Accent.TButton",
                     background=self.ACCENT, foreground="white",
                     font=("Segoe UI Semibold", 10), padding=8, relief="flat")
        s.map("Accent.TButton",
              background=[("active", "#6d28d9"), ("disabled", "#4b5563")])
        s.configure("Danger.TButton",
                     background=self.DANGER, foreground="white",
                     font=("Segoe UI Semibold", 10), padding=8, relief="flat")
        s.map("Danger.TButton",
              background=[("active", "#b91c1c"), ("disabled", "#4b5563")])
        s.configure("TProgressbar",
                     troughcolor=self.PANEL, background=self.ACCENT2,
                     thickness=6)

    def _chkvar(self, default=False):
        return tk.BooleanVar(value=default)


if __name__ == "__main__":
    app = FileCleanerApp()
    app.mainloop()
