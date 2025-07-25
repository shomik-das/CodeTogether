import React, { useState, useEffect } from 'react';

const Preview = ({ code, language }) => {
    const [previewContent, setPreviewContent] = useState('');

    useEffect(() => {
        console.log(language);
        setPreviewContent(
            language === 'html'
                ? code
                : '<div class="text-center p-4 text-gray-500">Preview is only available for HTML code.</div>'
        );
    }, [code, language]);

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
            {/* <div className="p-2">
                <p className="text-lg text-[#bbb8ff] mb-0">Preview</p>
            </div> */}

            <div className="flex-1 bg-white overflow-y-auto custom-scrollbar">
                <iframe
                    srcDoc={previewContent}
                    title="preview"
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        </div>
    );
};

export default Preview;
