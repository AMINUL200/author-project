// components/CustomTextEditor.jsx
import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

const CustomTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Start typing...',
  height = 400,
  disabled = false 
}) => {
  const editor = useRef(null);

  // Enhanced Configuration to allow pasting from external sources
  const config = {
    readonly: disabled,
    placeholder,
    height,
    toolbarButtonSize: 'medium',

    // ✅ Allow paste from AI, Google Docs, Word, etc.
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_html',
    processPasteHTML: (html) => html, // Do not strip formatting
    processPaste: (html) => html,
    allowPaste: true,
    pasteHTMLActionList: ['insert_as_html', 'insert_clear_html', 'insert_only_text'],

    // Toolbar customization
    removeButtons: [
      'image', 'file', 'video', 'media', 'source',
      'about', 'print', 'symbols', 'table', 'hr',
    ],
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough',
      '|', 'ul', 'ol', 'outdent', 'indent',
      '|', 'font', 'fontsize', 'brush', 'paragraph',
      '|', 'align', 'undo', 'redo',
      '|', 'link', 'unlink',
      '|', 'fullsize', 'preview'
    ],

    // UI settings
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarAdaptive: false,
  };

  return (
    <div className="custom-text-editor">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndex={1}
        onBlur={onChange} // Better performance
      />
    </div>
  );
};

export default CustomTextEditor;
