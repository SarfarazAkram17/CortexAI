import {
  Check,
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import Editor from "@monaco-editor/react";
import { useEffect } from "react";

const Artifact = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { artifacts } = useSelector((state) => state.message);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const artifactKey = artifacts[0]?.id ?? artifacts[0]?.title;
  const [prevArtifactKey, setPrevArtifactKey] = useState(artifactKey);

  if (artifactKey !== prevArtifactKey) {
    setPrevArtifactKey(artifactKey);
    setActiveFile(0);
    setTab("code");
  }

  if (artifacts.length == 0) return;

  const file = artifacts[0].files[activeFile] ?? artifacts[0].files[0];
  const htmlFile = artifacts[0]?.files?.find((f) => f.name === "index.html");
  const cssFile = artifacts[0]?.files?.find((f) => f.name === "style.css");
  const jsFile = artifacts[0]?.files?.find((f) => f.name === "script.js");

  const canPreview = Boolean(htmlFile);

  const previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${cssFile?.content || ""}
  </style>
</head>
<body>
    ${htmlFile?.content || ""}

  <script>
    ${jsFile?.content || ""}
  </script>
</body>
</html>
`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file.content || "");
    setCopiedCode(true);
    setTimeout(() => {
      setCopiedCode(false);
    }, 2000);
  };

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();

    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts")) return "typescript";
    if (name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".cpp")) return "cpp";
    if (name.endsWith(".c")) return "c";
    return "plaintext";
  };

  const PanelContent = ({ onClose }) => {
    return (
      <>
        {!collapsed ? (
          <div className="flex flex-col h-full bg-[#0d0f14]">
            <div className="px-3 sm:px-4 py-2 border-b border-white/6 flex flex-wrap items-center gap-x-2 gap-y-2 sm:gap-3 shrink-0">
              <button
                onClick={onClose ?? (() => setCollapsed(true))}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
              >
                {onClose ? <X size={16} /> : <PanelRightClose size={16} />}
              </button>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                  <Code2 size={12} className="text-indigo-400" />
                </div>

                <div
                  title={artifacts[0]?.title}
                  className="text-[13px] font-medium text-slate-200 truncate capitalize"
                >
                  {artifacts[0]?.title}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check size={15} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={15} /> Copy
                    </>
                  )}
                </button>
              </div>

              {canPreview && (
                <div className="flex items-center gap-1 bg-white/4 border border-white/6 p-1 rounded-lg shrink-0 order-last w-full justify-center sm:order-0 sm:w-auto sm:justify-start">
                  <button
                    onClick={() => setTab("code")}
                    className={`flex flex-1 justify-center items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 cursor-pointer ${tab === "code" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}
                  >
                    <Code2 size={11} /> Code
                  </button>
                  <button
                    onClick={() => setTab("preview")}
                    className={`flex flex-1 justify-center items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 cursor-pointer ${tab === "preview" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}
                  >
                    <Eye size={11} /> Preview
                  </button>
                </div>
              )}
            </div>

            {tab === "code" && (
              <div className="h-auto flex border-b border-white/6 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden shrink-0">
                {artifacts[0]?.files.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFile(i)}
                    className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/5 relative cursor-pointer bg-transparent ${activeFile === i ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    {f.name}
                    {activeFile === i && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              {tab == "preview" && canPreview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full w-full"
                >
                  <iframe
                    title="preview"
                    srcDoc={previewDoc}
                    sandbox="allow-scripts"
                    className="w-full h-full bg-white"
                  ></iframe>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full w-full"
                >
                  <Editor
                    theme="vs-dark"
                    value={file?.content}
                    language={detectLanguage(file?.name)}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      wordWrap: "on",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 16 },
                      lineNumbers: "on",
                      renderLineHighlight: "none",
                    }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-col h-full border-l border-white/6 bg-[#0d0f14] items-center py-4 gap-3 shrink-0">
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
            >
              <PanelRightOpen size={16} />
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                title={artifacts[0]?.title}
                className="text-[10px] font-medium text-slate-600 tracking-widest capitalize whitespace-nowrap"
                style={{
                  writingMode: "vertical-lr",
                }}
              >
                {artifacts[0]?.title}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-medium shadow-lg shadow-indigo-500/20 border-none cursor-pointer transition-colors duration-150"
      >
        <Code2 size={13} /> View Code
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[88vw] max-w-105 border border-white/6 overflow-hidden"
            >
              <PanelContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ width: 400 }}
        animate={{ width: collapsed ? 48 : 400 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex h-full border border-white/6 flex-col overflow-hidden shrink-0"
      >
        <PanelContent />
      </motion.div>
    </>
  );
};

export default Artifact;
