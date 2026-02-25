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

# Known "always useless" extensions
JUNK_EXTENSIONS = {
    ".tmp", ".temp", ".log", ".bak", ".old", ".chk", ".dmp", ".dump",
    ".~", ".swp", ".swo", ".DS_Store", ".Thumbs.db", ".thumbdata",
    ".crdownload", ".part", ".partial", ".cache",
}

# Signatures for basic corruption detection (magic bytes)
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
    """Return the number of days since the file was last accessed or modified."""
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
    """Heuristic corruption check: verifies magic bytes for known types."""
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
