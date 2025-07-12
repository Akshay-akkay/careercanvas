import React from 'react';
import Editor from '@monaco-editor/react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange, height = '45vh' }) => {
  const handleChange = (val: string | undefined) => {
    onChange(val ?? '');
  };

  return (
    <div style={{ height }} className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
      <Editor
        defaultLanguage="json"
        value={value}
        onChange={handleChange}
        options={{
          tabSize: 2,
          wordWrap: 'on',
          minimap: { enabled: false },
          automaticLayout: true,
          fontSize: 12,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
        theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
      />
    </div>
  );
}; 