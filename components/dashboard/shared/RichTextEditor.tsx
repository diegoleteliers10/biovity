"use client"

import {
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
  CodeIcon,
  LeftToRightBlockQuoteIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { marked } from "marked"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

type RichTextEditorProps = {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  toolbarSuffix?: React.ReactNode
}

const MenuButton = ({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "inline-flex size-7 items-center justify-center rounded text-sm transition-colors",
      isActive
        ? "bg-secondary/10 text-secondary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
      disabled && "opacity-40 cursor-not-allowed"
    )}
  >
    {children}
  </button>
)

const EDITOR_CONTENT_CSS = `
  .tiptap-editor-content {
    min-height: 120px;
    padding: 0.5rem 0.75rem;
  }
  .tiptap-editor-content:focus { outline: none; }
  .tiptap-editor-content p { margin: 0 0 0.25rem; }
  .tiptap-editor-content p:last-child { margin-bottom: 0; }
  .tiptap-editor-content ul {
    list-style-type: disc;
    padding-left: 1.25rem;
    margin: 0.25rem 0;
  }
  .tiptap-editor-content ul li { list-style-type: disc; }
  .tiptap-editor-content ul li::marker { color: var(--muted-foreground); }
  .tiptap-editor-content ol {
    list-style-type: decimal;
    padding-left: 1.25rem;
    margin: 0.25rem 0;
  }
  .tiptap-editor-content ol li { list-style-type: decimal; }
  .tiptap-editor-content ol li::marker { color: var(--muted-foreground); font-size: 0.75rem; }
  .tiptap-editor-content blockquote {
    border-left: 3px solid var(--secondary);
    padding-left: 0.75rem;
    margin: 0.25rem 0;
    color: var(--muted-foreground);
    font-style: italic;
  }
  .tiptap-editor-content code {
    background: var(--muted);
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.8em;
    font-family: monospace;
  }
  .tiptap-editor-content strong { font-weight: 600; }
  .tiptap-editor-content em { font-style: italic; }
  .tiptap-editor-content s { text-decoration: line-through; }
  .tiptap-editor-content .is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    color: var(--muted-foreground);
    pointer-events: none;
    position: absolute;
  }
`

export function RichTextEditor({
  content,
  onChange,
  placeholder,
  className,
  toolbarSuffix,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
        "data-placeholder": placeholder ?? "",
      },
    },
  })

  // Sync external content changes (e.g. from AI overwrite) into TipTap
  useEffect(() => {
    if (!editor) return
    const editorHTML = editor.getHTML()
    if (content !== editorHTML) {
      const html = (marked.parse(content) as string).trim()
      editor.commands.setContent(html)
    }
  }, [editor, content])

  if (!editor) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EDITOR_CONTENT_CSS }} />
      <div
        className={cn(
          "rounded-lg border border-input bg-background text-sm ring-offset-background relative",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1 py-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Negrita"
          >
            <HugeiconsIcon icon={TextBoldIcon} size={14} strokeWidth={1.5} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Cursiva"
          >
            <HugeiconsIcon icon={TextItalicIcon} size={14} strokeWidth={1.5} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Tachado"
          >
            <HugeiconsIcon icon={TextStrikethroughIcon} size={14} strokeWidth={1.5} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            title="Código"
          >
            <HugeiconsIcon icon={CodeIcon} size={14} strokeWidth={1.5} />
          </MenuButton>

          <div className="mx-1 h-4 w-px bg-border" />

          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Lista con puntos"
          >
            <HugeiconsIcon icon={LeftToRightListBulletIcon} size={14} strokeWidth={1.5} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Lista numerada"
          >
            <HugeiconsIcon icon={LeftToRightListNumberIcon} size={14} strokeWidth={1.5} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Cita"
          >
            <HugeiconsIcon icon={LeftToRightBlockQuoteIcon} size={14} strokeWidth={1.5} />
          </MenuButton>

          <div className="mx-1 h-4 w-px bg-border" />

          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Deshacer"
          >
            <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={14} strokeWidth={1.5} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Rehacer"
          >
            <HugeiconsIcon icon={ArrowTurnForwardIcon} size={14} strokeWidth={1.5} />
          </MenuButton>

          {toolbarSuffix && <div className="ml-1 flex items-center">{toolbarSuffix}</div>}
        </div>

        {/* Editor content */}
        <EditorContent editor={editor} />
      </div>
    </>
  )
}
