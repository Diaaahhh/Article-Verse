"use client";
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./EditorToolbar";
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
type Props = {
  content: string;
  onChange: (html: string) => void;
};

export default function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Link,
      TextStyle,
      Color,
      FontFamily,
      Image,
      Table.configure({
        resizable: true,
      }),

      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder: "Write your article content here...",
      }),
    ],

    content,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
useEffect(() => {
  editor?.commands.setContent(content);
}, [content]);
  return (
    <div className="border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900">
      <div className="bg-zinc-950 border-b border-zinc-700">
        <EditorToolbar editor={editor} />
      </div>

      <div className="p-6 min-h-[500px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
