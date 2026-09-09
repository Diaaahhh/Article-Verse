"use client";

import { Editor } from "@tiptap/react";
import { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { API_BASE_URL } from "../../constants/api";

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
  Check,
  X,
} from "lucide-react";

type Props = {
  editor: Editor | null;
};

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  const [showEmoji, setShowEmoji] = useState(false);

  // Link popup states
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const linkPopupRef = useRef<HTMLDivElement | null>(null);
  const linkInputRef = useRef<HTMLInputElement | null>(null);

  const fonts = [
    "Arial",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Tahoma",
  ];

  // --------------------------------------------------
  // Upload Image
  // --------------------------------------------------

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    // const data = await res.json();

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

  // --------------------------------------------------
  // Link Popup
  // --------------------------------------------------

  const openLinkPopup = () => {
    // If selected text already has a link, show the existing URL
    const existingLink = editor.getAttributes("link").href || "";

    setLinkUrl(existingLink);
    setShowLinkPopup(true);

    // Focus input after popup appears
    setTimeout(() => {
      linkInputRef.current?.focus();
    }, 50);
  };

  const addLink = () => {
    const url = linkUrl.trim();

    if (!url) {
      setShowLinkPopup(false);
      return;
    }

    // Add https:// automatically if user doesn't provide a protocol
    const formattedUrl =
      /^https?:\/\//i.test(url)
        ? url
        : `https://${url}`;

    editor
      .chain()
      .focus()
      .setLink({
        href: formattedUrl,
      })
      .run();

    setShowLinkPopup(false);
    setLinkUrl("");
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();

    setShowLinkPopup(false);
    setLinkUrl("");
  };

  // --------------------------------------------------
  // Close popup when clicking outside
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        linkPopupRef.current &&
        !linkPopupRef.current.contains(event.target as Node)
      ) {
        setShowLinkPopup(false);
      }
    };

    if (showLinkPopup) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showLinkPopup]);

  // --------------------------------------------------
  // Enter key inside URL input
  // --------------------------------------------------

  const handleLinkKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLink();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setShowLinkPopup(false);
    }
  };

  // --------------------------------------------------
  // Toolbar button style
  // --------------------------------------------------

  const btn =
    "h-9 w-9 flex items-center justify-center rounded-md hover:bg-zinc-700 transition";

  return (
    <div
      className="relative flex flex-wrap items-center gap-1 border-b border-zinc-700 bg-zinc-900 px-3 py-2"
      style={{
        padding: "5px",
      }}
    >
      {/* Bold */}
      <button
        type="button"
        className={btn}
        onClick={() =>
          editor.chain().focus().toggleBold().run()
        }
        title="Bold"
      >
        <Bold size={18} />
      </button>

      {/* Italic */}
      <button
        type="button"
        className={btn}
        onClick={() =>
          editor.chain().focus().toggleItalic().run()
        }
        title="Italic"
      >
        <Italic size={18} />
      </button>

      {/* Underline */}
      <button
        type="button"
        className={btn}
        onClick={() =>
          editor.chain().focus().toggleUnderline().run()
        }
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>

      {/* Headings */}
      <select
        className="h-9 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-sm"
        style={{
          padding: "5px",
          width: "90px",
        }}
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;

          if (value === "h1") {
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run();
          }

          if (value === "h2") {
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run();
          }

          if (value === "paragraph") {
            editor
              .chain()
              .focus()
              .setParagraph()
              .run();
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
          width: "90px",
        }}
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;

          switch (value) {
            case "bullet":
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run();
              break;

            case "ordered":
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run();
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
        onClick={() =>
          editor.chain().focus().toggleBlockquote().run()
        }
        title="Quote"
      >
        <Quote size={18} />
      </button>

      {/* Undo */}
      <button
        type="button"
        className={btn}
        onClick={() =>
          editor.chain().focus().undo().run()
        }
        title="Undo"
      >
        <Undo2 size={18} />
      </button>

      {/* Redo */}
      <button
        type="button"
        className={btn}
        onClick={() =>
          editor.chain().focus().redo().run()
        }
        title="Redo"
      >
        <Redo2 size={18} />
      </button>

      {/* Text Alignment */}
      <select
        className="h-9 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-sm"
        style={{
          padding: "5px",
          width: "90px",
        }}
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;

          if (value) {
            editor
              .chain()
              .focus()
              .setTextAlign(value)
              .run();
          }

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
          width: "90px",
        }}
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;

          if (value !== "Font") {
            editor
              .chain()
              .focus()
              .setFontFamily(value)
              .run();
          }
        }}
      >
        <option value="">Font</option>

        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      {/* Colours */}
      <label className={btn} title="Text Color">
        🎨

        <input
          type="color"
          hidden
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .setColor(e.target.value)
              .run()
          }
        />
      </label>

      {/* --------------------------------------------------
          Link
      -------------------------------------------------- */}

      <div
        className="relative"
        ref={linkPopupRef}
      >
        {/* Link Button */}
        <button
          type="button"
          className={btn}
          onClick={openLinkPopup}
          title="Add Link"
        >
          <Link2 size={18} />
        </button>

        {/* Link Popup */}
        {showLinkPopup && (
          <div
            className="absolute left-0 top-11 z-[1000] w-72 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl"
            style={{
              boxShadow:
                "0 10px 30px rgba(0, 0, 0, 0.45)",
            }}
          >
            {/* Popup Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">
                Add Link
              </span>

              <button
                type="button"
                onClick={() => {
                  setShowLinkPopup(false);
                  setLinkUrl("");
                }}
                className="h-6 w-6 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-700 hover:text-white transition"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* URL Input */}
            <input
              ref={linkInputRef}
              type="text"
              value={linkUrl}
              onChange={(e) =>
                setLinkUrl(e.target.value)
              }
              onKeyDown={handleLinkKeyDown}
              placeholder="https://example.com"
              className="w-full h-9 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500"
            />

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 mt-3">
              {/* Remove Link */}
              {editor.isActive("link") && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition"
                >
                  Remove
                </button>
              )}

              {/* Cancel */}
              <button
                type="button"
                onClick={() => {
                  setShowLinkPopup(false);
                  setLinkUrl("");
                }}
                className="h-8 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:bg-zinc-700 transition"
              >
                Cancel
              </button>

              {/* Add */}
              <button
                type="button"
                onClick={addLink}
                className="h-8 px-3 rounded-lg bg-zinc-700 text-xs font-semibold text-white hover:bg-zinc-600 transition flex items-center gap-1.5"
              >
                <Check size={14} />
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emoji */}
      <button
        type="button"
        className={btn}
        onClick={() =>
          setShowEmoji(!showEmoji)
        }
        title="Emoji"
      >
        😀
      </button>

      {showEmoji && (
        <EmojiPicker
          onEmojiClick={(emoji) => {
            editor
              .chain()
              .focus()
              .insertContent(emoji.emoji)
              .run();
          }}
        />
      )}

      {/* Table */}
      <select
        className="border px-2 py-1 rounded bg-transparent"
        style={{
          padding: "5px",
          width: "90px",
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
              editor
                .chain()
                .focus()
                .addRowAfter()
                .run();
              break;

            case "column":
              editor
                .chain()
                .focus()
                .addColumnAfter()
                .run();
              break;

            case "delete":
              editor
                .chain()
                .focus()
                .deleteTable()
                .run();
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
      {/* 
      <label className={btn}>
        <ImageIcon size={18} />
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={uploadImage}
        />
      </label>
      */}
    </div>
  );
}