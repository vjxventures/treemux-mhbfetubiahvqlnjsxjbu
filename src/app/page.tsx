import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            CodeMentor AI
          </h1>
          <p className="text-gray-300 text-lg">
            Your intelligent pair programming assistant
          </p>
        </div>
        <CodeEditor />
      </div>
    </main>
  );
}
