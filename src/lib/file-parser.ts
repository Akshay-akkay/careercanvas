import * as pdfjs from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import mammoth from 'mammoth';

// Set workerSrc for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const parseFileText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          return reject(new Error('Could not read file.'));
        }

        if (file.type === 'application/pdf') {
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          let textContent = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map(item => ('str' in item ? item.str : '')).join(' ');
          }
          resolve(textContent);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } else {
          reject(new Error('Unsupported file format. Please upload a PDF or DOCX file.'));
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        reject(new Error('Failed to parse the document. It might be corrupted or protected.'));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};
