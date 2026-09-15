#!/usr/bin/env python3
"""Extract rendered Tieba posts from locally saved HTML without external packages."""

from __future__ import annotations

import html
import json
import argparse
from html.parser import HTMLParser
from pathlib import Path


class TiebaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, set[str]]] = []
        self.current: dict | None = None
        self.pending_author: list[str] = []
        self.current_author: list[str] | None = None
        self.current_meta: list[str] | None = None
        self.posts: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        classes = set(values.get("class", "").split())
        is_void = tag in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
        if not is_void:
            self.stack.append((tag, classes))

        if "user-info" in classes:
            self.current_author = []
        if "comment-content" in classes:
            self.current = {"author": normalize(" ".join(self.pending_author)), "content": [], "meta": "", "images": []}
        if "pc-pb-comments-desc" in classes:
            self.current_meta = []

        if self.current is not None and tag == "img" and self.in_class("comment-content"):
            src = values.get("src", "")
            alt = values.get("alt", "")
            if src and "emoticon" not in src and "avatar" not in " ".join(classes):
                self.current["images"].append({"src": src, "alt": alt})

        if tag == "br" and self.current is not None and self.in_class("comment-content"):
            self.current["content"].append("\n")

    def handle_endtag(self, tag: str) -> None:
        if not self.stack:
            return

        closing_classes: set[str] = set()
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                closing_classes = self.stack[index][1]
                del self.stack[index:]
                break

        if "user-info" in closing_classes and self.current_author is not None:
            self.pending_author = self.current_author
            self.current_author = None

        if "comment-content" in closing_classes and self.current is not None:
            post = {
                "author": self.current["author"],
                "content": normalize(" ".join(self.current["content"]), keep_lines=True),
                "meta": self.current["meta"],
                "images": unique_images(self.current["images"]),
            }
            if post["content"] or post["images"]:
                self.posts.append(post)
            self.current = None

        if "pc-pb-comments-desc" in closing_classes and self.current_meta is not None:
            if self.posts:
                self.posts[-1]["meta"] = normalize(" ".join(self.current_meta))
            self.current_meta = None

    def handle_data(self, data: str) -> None:
        if not data.strip():
            return
        if self.current is not None and self.in_class("comment-content"):
            self.current["content"].append(data)
        elif self.current_meta is not None and self.in_class("pc-pb-comments-desc"):
            self.current_meta.append(data)
        elif self.current_author is not None and self.in_class("user-info"):
            self.current_author.append(data)

    def in_class(self, name: str) -> bool:
        return any(name in classes for _, classes in self.stack)


def normalize(value: str, keep_lines: bool = False) -> str:
    value = html.unescape(value).replace("\xa0", " ")
    if keep_lines:
        lines = [" ".join(line.split()) for line in value.splitlines()]
        return "\n".join(line for line in lines if line)
    return " ".join(value.split())


def unique_images(images: list[dict]) -> list[dict]:
    seen: set[str] = set()
    result = []
    for image in images:
        if image["src"] not in seen:
            seen.add(image["src"])
            result.append(image)
    return result


def main() -> None:
    argument_parser = argparse.ArgumentParser()
    argument_parser.add_argument("html", nargs="+")
    argument_parser.add_argument("--output", type=Path)
    args = argument_parser.parse_args()

    output = []
    for raw_path in args.html:
        path = Path(raw_path)
        parser = TiebaParser()
        parser.feed(path.read_text(encoding="utf-8", errors="replace"))
        output.append({"source": str(path), "posts": parser.posts})
    rendered = json.dumps(output, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")


if __name__ == "__main__":
    main()
