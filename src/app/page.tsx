import CodeEditor from "@/components/CodeEditor";
import { Sparkles, Code2, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-purple-200">Powered by Claude AI</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            CodeMentor AI
          </h1>
          <p className="text-gray-300 text-xl mb-6 max-w-2xl mx-auto">
            Your intelligent pair programming assistant that analyzes code in real-time
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>7+ Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Security Checks</span>
            </div>
          </div>
        </div>
        <CodeEditor />
      </div>
    </main>
  );
}
