import React from 'react';
import Card from './common/Card';
import Button from './common/Button';

interface PromptDisplayModalProps {
  promptText: string;
  onClose: () => void;
}

const PromptDisplayModal: React.FC<PromptDisplayModalProps> = ({ promptText, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-title"
    >
      <Card 
        className="w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="prompt-title" className="text-lg font-semibold">پرامپت ساخت برنامه</h2>
        </div>
        <pre className="flex-1 p-4 overflow-y-auto text-sm whitespace-pre-wrap font-sans bg-gray-50 dark:bg-gray-900 rounded-b-xl">
          <code>
            {promptText}
          </code>
        </pre>
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-left">
           <Button onClick={onClose}>بستن</Button>
        </div>
      </Card>
    </div>
  );
};

export default PromptDisplayModal;
