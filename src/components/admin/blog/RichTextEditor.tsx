'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3, List, ListOrdered, Quote, Link2, Link2Off, ImagePlus, Minus, Undo2, Redo2, Loader2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/upload-image'

interface Props {
  value: string
  onChange: (html: string) => void
  dir: 'ltr' | 'rtl'
  placeholder: string
}

function Btn({ active, disabled, onClick, title, children }: { active?: boolean; disabled?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button type="button" title={title} aria-label={title} disabled={disabled} onMouseDown={e => e.preventDefault()} onClick={onClick}
      className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${active ? 'bg-navy-800 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700'}`}>
      {children}
    </button>
  )
}

function Toolbar({ editor, onPickImage, uploading }: { editor: Editor; onPickImage: () => void; uploading: boolean }) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [url, setUrl] = useState('')
  const s = useEditorState({
    editor,
    selector: ctx => ({
      bold: ctx.editor.isActive('bold'), italic: ctx.editor.isActive('italic'), underline: ctx.editor.isActive('underline'),
      h2: ctx.editor.isActive('heading', { level: 2 }), h3: ctx.editor.isActive('heading', { level: 3 }),
      ul: ctx.editor.isActive('bulletList'), ol: ctx.editor.isActive('orderedList'), quote: ctx.editor.isActive('blockquote'),
      link: ctx.editor.isActive('link'), canUndo: ctx.editor.can().undo(), canRedo: ctx.editor.can().redo(),
    }),
  })

  const openLink = () => { setUrl(editor.getAttributes('link').href || ''); setLinkOpen(true) }
  const applyLink = () => {
    const href = url.trim()
    if (!href) editor.chain().focus().extendMarkRange('link').unsetLink().run()
    else {
      const safe = /^(https?:\/\/|mailto:|tel:)/i.test(href) ? href : `https://${href}`
      editor.chain().focus().extendMarkRange('link').setLink({ href: safe }).run()
    }
    setLinkOpen(false)
  }

  return (
    <div className="border-b border-gray-200 dark:border-navy-600 bg-gray-50/80 dark:bg-navy-900/60 rounded-t-xl">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5">
        <Btn title="Heading" active={s.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></Btn>
        <Btn title="Sub-heading" active={s.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></Btn>
        <span className="w-px h-5 bg-gray-200 dark:bg-navy-600 mx-1" />
        <Btn title="Bold" active={s.bold} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Btn>
        <Btn title="Italic" active={s.italic} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Btn>
        <Btn title="Underline" active={s.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></Btn>
        <span className="w-px h-5 bg-gray-200 dark:bg-navy-600 mx-1" />
        <Btn title="Bulleted list" active={s.ul} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Btn>
        <Btn title="Numbered list" active={s.ol} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Btn>
        <Btn title="Quote" active={s.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></Btn>
        <span className="w-px h-5 bg-gray-200 dark:bg-navy-600 mx-1" />
        <Btn title="Add link" active={s.link} onClick={openLink}><Link2 className="w-4 h-4" /></Btn>
        {s.link && <Btn title="Remove link" onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}><Link2Off className="w-4 h-4" /></Btn>}
        <Btn title="Insert image" disabled={uploading} onClick={onPickImage}>{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}</Btn>
        <Btn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="w-4 h-4" /></Btn>
        <span className="flex-1" />
        <Btn title="Undo" disabled={!s.canUndo} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="w-4 h-4" /></Btn>
        <Btn title="Redo" disabled={!s.canRedo} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="w-4 h-4" /></Btn>
      </div>
      {linkOpen && (
        <div className="flex items-center gap-2 px-3 pb-2">
          <input autoFocus value={url} onChange={e => setUrl(e.target.value)} dir="ltr" placeholder="https://example.com"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyLink() } if (e.key === 'Escape') setLinkOpen(false) }}
            className="flex-1 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none focus:border-navy-500" />
          <button type="button" onClick={applyLink} className="p-2 rounded-lg bg-navy-800 text-white" aria-label="Apply link"><Check className="w-4 h-4" /></button>
          <button type="button" onClick={() => setLinkOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700" aria-label="Cancel"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  )
}

export function RichTextEditor({ value, onChange, dir, placeholder }: Props) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<Editor | null>(null)

  const insertFiles = useCallback(async (files: File[]) => {
    const images = files.filter(f => f.type.startsWith('image/'))
    if (!images.length) return
    setUploading(true)
    for (const file of images) {
      const res = await uploadImage(file)
      if (res.url) editorRef.current?.chain().focus().setImage({ src: res.url, alt: file.name.replace(/\.[^.]+$/, '') }).run()
      else toast.error(res.error || 'Upload failed')
    }
    setUploading(false)
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow' } } }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: { class: 'article-body', dir },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files || [])
        if (files.some(f => f.type.startsWith('image/'))) { insertFiles(files); return true }
        return false
      },
      handleDrop: (_view, event) => {
        const files = Array.from((event as DragEvent).dataTransfer?.files || [])
        if (files.some(f => f.type.startsWith('image/'))) { event.preventDefault(); insertFiles(files); return true }
        return false
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  })

  useEffect(() => { editorRef.current = editor }, [editor])

  return (
    <div className="rich-editor border border-gray-200 dark:border-navy-600 rounded-xl bg-white dark:bg-navy-800 focus-within:border-navy-500 transition-colors">
      {editor && <Toolbar editor={editor} uploading={uploading} onPickImage={() => fileRef.current?.click()} />}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden"
        onChange={e => { insertFiles(Array.from(e.target.files || [])); e.target.value = '' }} />
      <EditorContent editor={editor} />
    </div>
  )
}
