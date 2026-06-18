"use client";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {API_BASE_URL} from "../../constants/api";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Undo2,
  Redo2,
  Quote,
  Link2,
  ImageIcon,
  Table2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading,
} from "lucide-react";
type Props = {
  editor: Editor | null;
};

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null;
  const [showEmoji, setShowEmoji] = useState(false);
  const fonts = ["Arial", "Times New Roman", "Georgia", "Verdana", "Tahoma"];
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    // const res = await fetch(`${API_BASE_URL}/api/upload-editor-image`, {
    //   method: "POST",
    //   body: formData,
    //   credentials: "include",
    // });
// if (!res.ok) {
//   console.error("Upload failed", await res.text());
//   return;
// }
//     const data = await res.json();

    // if (data.url) {
    //   editor
    //     ?.chain()
    //     .focus()
    //     .setImage({
    //       src: data.url,
    //     })
    //     .run();
    // }
  };
  const btn =
    "h-9 w-9 flex items-center justify-center rounded-md hover:bg-zinc-700 transition";
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-zinc-700 bg-zinc-900 px-3 py-2"
    style={{
            padding: "5px"
        }}>
      {/* Bold */}
      <button
        type="button"
        className={btn}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={18} />
      </button>
      {/* Italic */}
      <button
        type="button"
        className={btn}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={18} />
      </button>
      {/* Underline */}
      <button
        type="button"
        className={btn}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={18} />
      </button>
      {/* Headings */}
      <select
        className="h-9 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-sm"
        style={{
            padding: "5px",
            width: "90px"
        }}
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;

          if (value === "h1") {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }

          if (value === "h2") {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }

          if (value === "paragraph") {
            editor.chain().focus().setParagraph().run();
          }

          e.target.value = "";
        }}
      >
        <option value="">Heading</option>
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
      </select>
      {/* Lists */}
      <select
        className="h-9 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-sm"
        style={{
            padding: "5px",
            width: "90px"
        }}
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;

          switch (value) {
            case "bullet":
              editor.chain().focus().toggleBulletList().run();
              break;

            case "ordered":
              editor.chain().focus().toggleOrderedList().run();
              break;
          }

          e.target.value = "";
        }}
      >
        <option value="">List</option>
        <option value="bullet">Bullet List</option>
        <option value="ordered">Numbered List</option>
      </select>
      {/* Quote */}
      <button
        type="button"
        className={btn}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={18} />
      </button>
      {/* Undo- Redo */}
      <button
        type="button"
        className={btn}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={18} />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={18} />
      </button>

      {/* Text alignment */}
      <select
        className="h-9 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-sm"
        style={{
            padding: "5px",
            width: "90px"
        }}
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;

          editor.chain().focus().setTextAlign(value).run();

          e.target.value = "";
        }}
      >
        <option value="">Align</option>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>

      {/* Font Family */}
      <select
        className="h-9 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-sm"
        style={{
            padding: "5px",
            width: "90px"
        }}
        onChange={(e) =>
          editor.chain().focus().setFontFamily(e.target.value).run()
        }
      >
        <option>Font</option>

        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      {/* Colours */}
      <label className={btn}>
        🎨
        <input
          type="color"
          hidden
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />
      </label>
      {/* <input
        type="color"
        onChange={(e) =>
          editor
            .chain()
            .focus()
            .toggleHighlight({
              color: e.target.value,
            })
            .run()
        }
      /> */}

      {/* Link */}
      <button
        type="button"
        className={btn}
        onClick={() => {
          const url = prompt("Enter URL");

          if (!url) return;

          editor
            .chain()
            .focus()
            .setLink({
              href: url,
            })
            .run();
        }}
      >
        <Link2 size={18} />
      </button>

      {/* Emoji */}
      <button
        type="button"
        className={btn}
        onClick={() => setShowEmoji(!showEmoji)}
      >
        😀
      </button>
      {showEmoji && (
        <EmojiPicker
          onEmojiClick={(emoji) => {
            editor.chain().focus().insertContent(emoji.emoji).run();
          }}
        />
      )}

      {/* Table */}
      <select
        className="border px-2 py-1 rounded bg-transparent"
        style={{
            padding: "5px",
            width: "90px"
        }}
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;

          switch (value) {
            case "create":
              editor
                .chain()
                .focus()
                .insertTable({
                  rows: 3,
                  cols: 3,
                  withHeaderRow: true,
                })
                .run();
              break;

            case "row":
              editor.chain().focus().addRowAfter().run();
              break;

            case "column":
              editor.chain().focus().addColumnAfter().run();
              break;

            case "delete":
              editor.chain().focus().deleteTable().run();
              break;
          }

          e.target.value = "";
        }}
      >
        <option value="">Table</option>

        <option value="create">Create Table</option>

        <option value="row">Add Row</option>

        <option value="column">Add Column</option>

        <option value="delete">Delete Table</option>
      </select>

      {/* Image */}
      {/* <label className={btn}>
        <ImageIcon size={18} />

        <input type="file" hidden accept="image/*" onChange={uploadImage} />
      </label> */}
    </div>
  );
}
