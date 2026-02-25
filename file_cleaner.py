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
        self._build_ui()

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

    def _build_ui(self):
        # ── Top bar ────────────────────────────────────────────────────────
        top = tk.Frame(self, bg=self.BG, pady=12, padx=16)
        top.pack(fill="x")
        tk.Label(top, text="🧹 File Cleanup Utility", bg=self.BG,
                 fg=self.TXT, font=("Segoe UI Semibold", 18)).pack(side="left")
        tk.Label(top, text=f"Flags files unused >{MONTHS_THRESHOLD} months",
                 bg=self.BG, fg=self.TXT_DIM,
                 font=("Segoe UI", 10)).pack(side="left", padx=12)

        # ── Folder bar ─────────────────────────────────────────────────────
        bar = tk.Frame(self, bg=self.PANEL, padx=12, pady=10)
        bar.pack(fill="x", padx=16, pady=(0, 8))
        tk.Label(bar, text="Scan folder:", bg=self.PANEL, fg=self.TXT,
                 font=("Segoe UI", 10)).pack(side="left")
        entry = tk.Entry(bar, textvariable=self.scan_dir,
                         bg=self.BG, fg=self.TXT, insertbackground=self.TXT,
                         relief="flat", font=("Segoe UI", 10), width=60)
        entry.pack(side="left", padx=8, ipady=4)
        ttk.Button(bar, text="Browse…", style="Accent.TButton",
                   command=self._browse).pack(side="left")
        self.btn_scan = ttk.Button(bar, text="⚡ Scan", style="Accent.TButton",
                                   command=self._start_scan)
        self.btn_scan.pack(side="left", padx=6)

        # ── Filter checkboxes ──────────────────────────────────────────────
        frow = tk.Frame(self, bg=self.BG, padx=16)
        frow.pack(fill="x", pady=(0, 4))
        self.chk_all_old   = self._chkvar()
        self.chk_empty     = self._chkvar(True)
        self.chk_corrupted = self._chkvar(True)
        self.chk_junk      = self._chkvar(True)
        for text, var in [
            (f"Old (>{MONTHS_THRESHOLD} mo)", self.chk_all_old),
            ("Empty files",                    self.chk_empty),
            ("Corrupted files",                self.chk_corrupted),
            ("Junk extensions",                self.chk_junk),
        ]:
            tk.Checkbutton(frow, text=text, variable=var,
                           bg=self.BG, fg=self.TXT, activebackground=self.BG,
                           activeforeground=self.TXT, selectcolor=self.ACCENT,
                           font=("Segoe UI", 10)).pack(side="left", padx=8)

        # ── Progress bar ───────────────────────────────────────────────────
        self.progress = ttk.Progressbar(self, style="TProgressbar",
                                        mode="indeterminate")
        self.progress.pack(fill="x", padx=16, pady=(0, 4))

        # ── Treeview ───────────────────────────────────────────────────────
        frame = tk.Frame(self, bg=self.BG, padx=16)
        frame.pack(fill="both", expand=True)
        cols = ("select", "name", "path", "type", "size", "last_used", "age")
        self.tree = ttk.Treeview(frame, columns=cols, show="headings",
                                  selectmode="extended")
        headings = {
            "select":    ("☑",         45,  "center"),
            "name":      ("File Name", 200, "w"),
            "path":      ("Path",      260, "w"),
            "type":      ("Issue",      95, "center"),
            "size":      ("Size",       75, "center"),
            "last_used": ("Last Used", 130, "center"),
            "age":       ("Age",        85, "center"),
        }
        for col, (title, width, anchor) in headings.items():
            self.tree.heading(col, text=title,
                              command=lambda c=col: self._sort_by(c))
            self.tree.column(col, width=width, anchor=anchor, stretch=(col == "path"))
        vsb = ttk.Scrollbar(frame, orient="vertical", command=self.tree.yview,
                             style="Vertical.TScrollbar")
        self.tree.configure(yscrollcommand=vsb.set)
        self.tree.pack(side="left", fill="both", expand=True)
        vsb.pack(side="right", fill="y")
        self.tree.tag_configure("empty",     foreground="#60a5fa")
        self.tree.tag_configure("corrupted", foreground=self.DANGER)
        self.tree.tag_configure("junk",      foreground=self.WARNING)
        self.tree.tag_configure("old",       foreground=self.TXT_DIM)
        self.tree.tag_configure("checked",   background="#2d2d44")
        self.tree.bind("<Button-1>", self._on_click)

        # ── Bottom bar ─────────────────────────────────────────────────────
        bot = tk.Frame(self, bg=self.PANEL, padx=16, pady=10)
        bot.pack(fill="x")
        self.lbl_status = tk.Label(bot, textvariable=self.status_text,
                                   bg=self.PANEL, fg=self.TXT_DIM,
                                   font=("Segoe UI", 10))
        self.lbl_status.pack(side="left")
        self.btn_delete = ttk.Button(bot, text="🗑  Delete Selected",
                                      style="Danger.TButton",
                                      command=self._confirm_delete,
                                      state="disabled")
        self.btn_delete.pack(side="right", padx=4)
        ttk.Button(bot, text="Select All",   style="Accent.TButton",
                   command=self._select_all).pack(side="right", padx=4)
        ttk.Button(bot, text="Deselect All", style="Accent.TButton",
                   command=self._deselect_all).pack(side="right", padx=4)
        self.lbl_selected = tk.Label(bot, text="0 selected",
                                     bg=self.PANEL, fg=self.ACCENT2,
                                     font=("Segoe UI Semibold", 10))
        self.lbl_selected.pack(side="right", padx=12)

    def _browse(self):
        d = filedialog.askdirectory(title="Select folder to scan")
        if d:
            self.scan_dir.set(d)

    def _on_click(self, event):
        iid = self.tree.identify_row(event.y)
        if not iid:
            return
        if iid in self._selected_items:
            self._selected_items.discard(iid)
            self.tree.set(iid, "select", "☐")
            tags = [t for t in self.tree.item(iid, "tags") if t != "checked"]
        else:
            self._selected_items.add(iid)
            self.tree.set(iid, "select", "☑")
            tags = list(self.tree.item(iid, "tags")) + ["checked"]
        self.tree.item(iid, tags=tags)
        self._update_selected_label()

    def _select_all(self):
        for iid in self.tree.get_children():
            self._selected_items.add(iid)
            self.tree.set(iid, "select", "☑")
            tags = list(self.tree.item(iid, "tags"))
            if "checked" not in tags:
                tags.append("checked")
            self.tree.item(iid, tags=tags)
        self._update_selected_label()

    def _deselect_all(self):
        for iid in self.tree.get_children():
            self._selected_items.discard(iid)
            self.tree.set(iid, "select", "☐")
            tags = [t for t in self.tree.item(iid, "tags") if t != "checked"]
            self.tree.item(iid, tags=tags)
        self._update_selected_label()

    def _update_selected_label(self):
        n = len(self._selected_items)
        self.lbl_selected.config(text=f"{n} selected")
        self.btn_delete.configure(state="normal" if n > 0 else "disabled")

    def _sort_by(self, col):
        items = [(self.tree.set(k, col), k) for k in self.tree.get_children()]
        try:
            items.sort(key=lambda t: float(t[0].split()[0]) if t[0].replace(".", "").split()[0].isdigit() else t[0])
        except Exception:
            items.sort()
        for index, (_, k) in enumerate(items):
            self.tree.move(k, "", index)

    def _start_scan(self): pass
    def _scan_worker(self, folder): pass
    def _scan_done(self): pass
    def _confirm_delete(self): pass
    def _delete_files(self, files, iids): pass


if __name__ == "__main__":
    app = FileCleanerApp()
    app.mainloop()
