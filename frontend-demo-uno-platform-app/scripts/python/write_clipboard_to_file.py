import os
import sys
import pyperclip
import re
from typing import List, Tuple

# Regex to identify a file block delimiter.
# It matches a line starting with '///' followed by a file path.
# The captured group (1) holds the target file path.
FILE_SPLIT_PATTERN = re.compile(r"^///\s*([^\n]+)", re.MULTILINE)


def parse_content(content: str) -> List[Tuple[str, str]]:
    """
    Splits the large text block into (file_path, content) tuples
    based on the FILE_SPLIT_PATTERN.
    """
    blocks = FILE_SPLIT_PATTERN.split(content)
    extracted_files = []

    # The split result format is typically:
    # [Text before first match, Match 1 (Path 1), Content 1, Match 2 (Path 2), Content 2, ...]
    for i in range(1, len(blocks), 2):
        file_path = blocks[i].strip()
        file_content = blocks[i + 1].strip()

        if file_path and file_content:
            extracted_files.append((file_path, file_content))

    return extracted_files


def write_files(extracted_files: List[Tuple[str, str]]):
    """
    Creates directories and writes the content for each extracted file block.
    """
    total_files = len(extracted_files)
    if total_files == 0:
        print("❌ No valid file blocks found matching the '/// <file path>' pattern.")
        return

    print(f"\n📝 Starting write operation for {total_files} file(s)...")

    for i, (file_path, file_content) in enumerate(extracted_files):
        try:
            os.makedirs(os.path.dirname(file_path) or ".", exist_ok=True)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(file_content + "\n")
            print(f"  ✅ [{i+1}/{total_files}] Written: {file_path}")
        except Exception as e:
            print(f"  ❌ [{i+1}/{total_files}] Error writing file {file_path}: {e}")

    print("\n✨ All operations complete.")


def main():
    """
    Determines source (argument or clipboard), parses content, and writes files.
    """
    content = ""

    if len(sys.argv) > 1:
        source_file_path = sys.argv[1]
        try:
            with open(source_file_path, "r", encoding="utf-8") as f:
                content = f.read()
            print(f"📄 Reading content from source file: {source_file_path}")
        except FileNotFoundError:
            print(f"❌ Error: Source file not found at '{source_file_path}'")
            return
        except Exception as e:
            print(f"❌ Error reading file: {e}")
            return
    else:
        content = pyperclip.paste().replace("\r\n", "\n")
        print("📋 Reading content from clipboard...")

    if not content.strip():
        print(
            "❌ Error: No content found (clipboard is empty or source file is blank)."
        )
        return

    extracted_files = parse_content(content)
    write_files(extracted_files)


if __name__ == "__main__":
    main()
