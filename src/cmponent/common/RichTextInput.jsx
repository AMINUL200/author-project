import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";

const RichTextInput = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  label,
  className = "",
  height = "150px"
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      TextStyle,
      FontFamily,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange && onChange(html);
    },
    editorProps: {
      attributes: {
        class: `w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 prose prose-sm max-w-none bg-white ${className}`,
        style: `min-height: ${height}`,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
        {/* Font Size */}
        <select
          onChange={(e) => {
            const size = e.target.value;
            if (size === "paragraph") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().setHeading({ level: parseInt(size) }).run();
            }
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        {/* Font Family */}
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="">Font</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>

        {/* Text Color */}
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          title="Text Color"
        />

        {/* Basic Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bold") ? "bg-gray-300 text-purple-600" : ""
          }`}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-gray-300 text-purple-600 italic" : ""
          }`}
          title="Italic"
        >
          <em>I</em>
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bulletList") ? "bg-gray-300 text-purple-600" : ""
          }`}
          title="Bullet List"
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("orderedList") ? "bg-gray-300 text-purple-600" : ""
          }`}
          title="Numbered List"
        >
          1. List
        </button>

        {/* Link */}
        <button
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) {
              const text = prompt("Enter link text (optional):") || url;
              editor.chain().focus().setLink({ href: url }).insertContent(text).run();
            }
          }}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("link") ? "bg-gray-300 text-purple-600" : ""
          }`}
          title="Insert Link"
        >
          🔗
        </button>

        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove Link"
        >
          🚫🔗
        </button>

        {/* Clear Formatting */}
        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Clear Formatting"
        >
          🧹
        </button>

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          ↩️
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          ↪️
        </button>
      </div>

      {/* Editable area */}
      <div className="p-1">
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default RichTextInput;