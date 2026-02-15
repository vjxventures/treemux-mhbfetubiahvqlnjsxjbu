'use client';

import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Sparkles, Code2, Loader2, Copy, CheckCheck, MessageSquare, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
];

const DEFAULT_CODE = {
  javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  typescript: `interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user = { name: "Alice", age: 30 };
console.log(greet(user));`,
  python: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))`,
};

export default function CodeEditor() {
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAskInput, setShowAskInput] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const askQuestion = async () => {
    if (!question.trim() || !code.trim()) return;

    setIsAsking(true);
    setAnalysis('');
    setShowAskInput(false);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language, question }),
      });

      if (!response.ok) throw new Error('Question failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('0:')) {
              const content = line.substring(2).replace(/^"|"$/g, '');
              setAnalysis((prev) => prev + content);
            }
          }
        }
      }
    } catch (error) {
      setAnalysis('Error processing question. Please try again.');
    } finally {
      setIsAsking(false);
      setQuestion('');
    }
  };

  const analyzeCode = async (currentCode: string) => {
    if (!currentCode.trim()) {
      setAnalysis('');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: currentCode, language }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('0:')) {
              const content = line.substring(2).replace(/^"|"$/g, '');
              setAnalysis((prev) => prev + content);
            }
          }
        }
      }
    } catch (error) {
      setAnalysis('Error analyzing code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      analyzeCode(newCode);
    }, 2000);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const defaultCode = DEFAULT_CODE[newLanguage as keyof typeof DEFAULT_CODE] || '';
    setCode(defaultCode);
    setAnalysis('');
  };

  useEffect(() => {
    analyzeCode(code);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
      <div className="bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-semibold">Code Editor</h2>
          </div>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="h-[600px]">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <h2 className="text-white font-semibold">AI Analysis</h2>
          {(isAnalyzing || isAsking) && <Loader2 className="w-4 h-4 text-blue-300 animate-spin ml-auto" />}
          {!isAnalyzing && !isAsking && (
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setShowAskInput(!showAskInput)}
                className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-sm flex items-center gap-2 transition-colors"
                title="Ask a question"
              >
                <MessageSquare className="w-4 h-4" />
                Ask AI
              </button>
              {analysis && (
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-sm flex items-center gap-2 transition-colors"
                  title="Copy analysis"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        {showAskInput && (
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
                placeholder="Ask a question about your code..."
                className="flex-1 px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={askQuestion}
                disabled={!question.trim()}
                className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Ask
              </button>
            </div>
          </div>
        )}
        <div className="h-[600px] overflow-y-auto p-6">
          {analysis ? (
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-purple-300 prose-code:bg-slate-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              {isAnalyzing ? (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-400" />
                  <p>Analyzing your code...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  <p>Start typing to get AI-powered insights</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
