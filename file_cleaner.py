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
