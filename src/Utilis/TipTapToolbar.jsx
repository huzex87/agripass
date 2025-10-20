import React from "react";

const TipTapToolbar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter the URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const onChange1 = (e) => {
    const level = parseInt(e.target.value);
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };
  return (
    <>
      <div className="border border-gray-300 border-b-0 rounded-t-lg p-3 flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800">
        {/* Headers */}
        <select
          onChange={onChange1}
          className="select select-sm select-bordered max-w-xs"
          defaultValue=""
        >
          <option value="">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`btn btn-sm ${
            editor.isActive("bold") ? "btn-primary" : "btn-outline"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`btn btn-sm ${
            editor.isActive("italic") ? "btn-primary" : "btn-outline"
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`btn btn-sm ${
            editor.isActive("underline") ? "btn-primary" : "btn-outline"
          }`}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`btn btn-sm ${
            editor.isActive("strike") ? "btn-primary" : "btn-outline"
          }`}
        >
          <s>S</s>
        </button>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`btn btn-sm ${
            editor.isActive("bulletList") ? "btn-primary" : "btn-outline"
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`btn btn-sm ${
            editor.isActive("orderedList") ? "btn-primary" : "btn-outline"
          }`}
        >
          1. List
        </button>

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`btn btn-sm ${
            editor.isActive({ textAlign: "left" })
              ? "btn-primary"
              : "btn-outline"
          }`}
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`btn btn-sm ${
            editor.isActive({ textAlign: "center" })
              ? "btn-primary"
              : "btn-outline"
          }`}
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`btn btn-sm ${
            editor.isActive({ textAlign: "right" })
              ? "btn-primary"
              : "btn-outline"
          }`}
        >
          →
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`btn btn-sm ${
            editor.isActive("blockquote") ? "btn-primary" : "btn-outline"
          }`}
        >
          Quote
        </button>

        {/* Links */}
        <button
          type="button"
          onClick={addLink}
          className={`btn btn-sm ${
            editor.isActive("link") ? "btn-primary" : "btn-outline"
          }`}
        >
          Link
        </button>
        {editor.isActive("link") && (
          <button
            type="button"
            onClick={removeLink}
            className="btn btn-sm btn-error"
          >
            Unlink
          </button>
        )}

        {/* Color Picker */}
        {/* <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="w-10 h-8 border rounded cursor-pointer"
          title="Text Color"
        /> */}

        {/* Highlight */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`btn btn-sm ${
            editor.isActive("highlight") ? "btn-warning" : "btn-outline"
          }`}
        >
          Highlight
        </button>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          className="btn btn-sm btn-outline"
        >
          Clear
        </button>
      </div>
    </>
  );
};

export default TipTapToolbar;
