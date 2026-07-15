import React, { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variables?: { label: string; value: string }[];
  height?: string;
}

const sanitizeHtml = (html: string) => {
  return html
    .replace(/<script/g, '<')
    .replace(/on\w+=".*?"/g, '')
    .replace(/javascript:/g, '');
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter your message here...',
  variables = [
    { label: 'User', value: '{user}' },
    { label: 'Guild', value: '{guild}' },
    { label: 'Channel', value: '{channel}' },
    { label: 'Member Count', value: '{memberCount}' }
  ],
  height = '300px'
}) => {
  const [showPreview, setShowPreview] = useState(true);
  const [showVariables, setShowVariables] = useState(false);

  const handleFormat = (tag: string, prefix: string = '', suffix: string = '') => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end) || 'text';
      
      const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
      }, 0);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const text = textarea.value;
      const newText = text.substring(0, start) + variable + text.substring(start);
      onChange(newText);
    }
    setShowVariables(false);
  };

  const formatButtons = [
    { label: 'B', action: () => handleFormat('bold', '<b>', '</b>'), title: 'Bold' },
    { label: 'I', action: () => handleFormat('italic', '<i>', '</i>'), title: 'Italic' },
    { label: 'U', action: () => handleFormat('underline', '<u>', '</u>'), title: 'Underline' },
    { label: 'S', action: () => handleFormat('strike', '<s>', '</s>'), title: 'Strikethrough' },
    { label: '<>', action: () => handleFormat('code', '<code>', '</code>'), title: 'Code' },
    { label: 'H1', action: () => handleFormat('h1', '<h1>', '</h1>'), title: 'Header 1' },
    { label: 'H2', action: () => handleFormat('h2', '<h2>', '</h2>'), title: 'Header 2' },
    { label: '•', action: () => handleFormat('list', '<ul><li>', '</li></ul>'), title: 'List' },
    { label: '🔗', action: () => handleFormat('link', '<a href="', '">Link</a>'), title: 'Link' },
    { label: '🖼', action: () => handleFormat('image', '<img src="', '" alt="Image" />'), title: 'Image' }
  ];

  return (
    <div className="w-full border border-white/10 rounded-xl bg-[#121212] overflow-hidden flex flex-col" style={{ height }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-[#1a1a1a]">
        {formatButtons.map((btn) => (
          <button
            key={btn.title}
            onClick={btn.action}
            className="px-2 py-1 text-xs font-mono bg-white/5 hover:bg-white/10 rounded transition-colors"
            title={btn.title}
          >
            {btn.label}
          </button>
        ))}
        
        <div className="w-px h-4 bg-white/10 mx-1" />
        
        <div className="relative">
          <button
            onClick={() => setShowVariables(!showVariables)}
            className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded transition-colors flex items-center gap-1"
          >
            Variables <span className="text-[10px]">▼</span>
          </button>
          
          {showVariables && (
            <div className="absolute top-full left-0 mt-1 bg-[#242424] border border-white/10 rounded-lg shadow-xl z-50 min-w-[150px]">
              {variables.map((v) => (
                <button
                  key={v.value}
                  onClick={() => insertVariable(v.value)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors"
                >
                  <span className="text-theme-primary font-mono">{v.value}</span>
                  <span className="ml-2 text-gray-400">({v.label})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              showPreview ? 'bg-theme-primary text-black' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor & Preview */}
      <div className={`flex flex-1 min-h-0 flex-col md:flex-row ${showPreview ? '' : '!flex-col'}`}>
        {/* Textarea */}
        <div className={`flex-1 min-h-[200px] ${showPreview ? 'md:border-r border-b md:border-b-0 border-white/10' : ''}`}>
          <textarea
            id="editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="flex-1 min-h-[200px] overflow-auto bg-[#0A0A0A] p-4">
            <div className="text-xs text-gray-500 mb-2 font-mono uppercase tracking-wider">Live Preview</div>
            <div
              className="prose prose-invert prose-sm max-w-none text-white/90"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-[#1a1a1a] text-[10px] text-gray-500">
        <span>{value.length} characters</span>
        <span>HTML / Markdown</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
