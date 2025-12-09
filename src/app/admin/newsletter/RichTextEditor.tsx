'use client';

import { useRef, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Set initial content only on mount
  useEffect(() => {
    if (isInitialMount.current && editorRef.current) {
      editorRef.current.innerHTML = value;
      isInitialMount.current = false;
    }
  }, [value]);

  // Update content when value changes externally (e.g., loading existing newsletter)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      // Only update if the content is significantly different (not just formatting normalization)
      const currentText = editorRef.current.innerText.trim();
      const newText = new DOMParser().parseFromString(value, 'text/html').body.innerText.trim();
      if (currentText === '' && newText !== '') {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleFormat = useCallback((tag: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) {
      // If no text is selected, just apply the format for future typing
      execCommand('formatBlock', tag);
      return;
    }

    execCommand('formatBlock', tag);
  }, [execCommand]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter the URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const ToolbarButton = ({ onClick, title, children, active = false }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-primary-100 dark:hover:bg-slate-600 transition-colors ${
        active ? 'bg-primary-100 dark:bg-slate-600' : ''
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-primary-200 dark:border-slate-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-primary-50 dark:bg-slate-700/50 border-b border-primary-200 dark:border-slate-600">
        {/* Text Formatting */}
        <ToolbarButton onClick={() => execCommand('bold')} title="Bold (Ctrl+B)">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h8a4 4 0 100-8H6v8zm0 0h9a4 4 0 110 8H6v-8z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} title="Italic (Ctrl+I)">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4 4 4 4M6 16l4-4-4-4" />
          </svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('underline')} title="Underline (Ctrl+U)">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-slate-600 mx-1 self-center" />

        {/* Headings */}
        <ToolbarButton onClick={() => handleFormat('h2')} title="Heading 2">
          <span className="font-bold text-xs">H2</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => handleFormat('h3')} title="Heading 3">
          <span className="font-bold text-xs">H3</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => handleFormat('p')} title="Paragraph">
          <span className="text-xs">P</span>
        </ToolbarButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-slate-600 mx-1 self-center" />

        {/* Lists */}
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            <circle cx="2" cy="6" r="1" fill="currentColor" />
            <circle cx="2" cy="12" r="1" fill="currentColor" />
            <circle cx="2" cy="18" r="1" fill="currentColor" />
          </svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13" />
            <text x="1" y="8" fontSize="6" fill="currentColor">1</text>
            <text x="1" y="14" fontSize="6" fill="currentColor">2</text>
            <text x="1" y="20" fontSize="6" fill="currentColor">3</text>
          </svg>
        </ToolbarButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-slate-600 mx-1 self-center" />

        {/* Link */}
        <ToolbarButton onClick={insertLink} title="Insert Link">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('unlink')} title="Remove Link">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" stroke="red" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-slate-600 mx-1 self-center" />

        {/* Alignment */}
        <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Align Left">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
          </svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Align Center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-slate-600 mx-1 self-center" />

        {/* Undo/Redo */}
        <ToolbarButton onClick={() => execCommand('undo')} title="Undo (Ctrl+Z)">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('redo')} title="Redo (Ctrl+Y)">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 bg-white dark:bg-slate-800 text-primary-900 dark:text-white focus:outline-none prose prose-sm dark:prose-invert max-w-none"
        style={{
          wordBreak: 'break-word',
        }}
        data-placeholder={placeholder}
        onFocus={(e) => {
          if (e.currentTarget.innerHTML === '' || e.currentTarget.innerHTML === '<br>') {
            e.currentTarget.innerHTML = '';
          }
        }}
      />

      {/* HTML Preview Toggle */}
      <div className="p-2 bg-primary-50 dark:bg-slate-700/50 border-t border-primary-200 dark:border-slate-600">
        <details className="text-xs">
          <summary className="cursor-pointer text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            View HTML Source
          </summary>
          <pre className="mt-2 p-2 bg-primary-100 dark:bg-slate-700 rounded text-[10px] overflow-x-auto whitespace-pre-wrap max-h-32">
            {value}
          </pre>
        </details>
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
