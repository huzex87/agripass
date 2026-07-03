import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TipTapToolbar from "../../../../utils/TipTapToolbar";

const RichTextEditor = ({ value, onChange, error }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.getHTML().includes("<p>")) {
      editor.commands.setContent(
        "<p>Provide detailed information about your project, requirements, eligibility criteria, application process, and any other relevant details...</p>"
      );
    }
  }, [editor]);

  return (
    <div>
      <div className="border border-gray-300 rounded-lg">
        <TipTapToolbar editor={editor} />
        <div className="border border-gray-300 border-t-0 rounded-b-lg min-h-[250px]">
          <EditorContent
            editor={editor}
            className="prose max-w-none p-4 focus-within:outline-none rounded-b-lg"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      <p className="text-sm text-gray-500 mt-2">
        Use the toolbar above to format your text, create lists, add links, and
        organize your content like a professional.
      </p>
    </div>
  );
};

export default RichTextEditor;
