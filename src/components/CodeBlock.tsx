import { useState } from "react";
import { AppIcon } from "./AppIcon.tsx";

const keywordPattern = /^(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|var|void|volatile|while|true|false|null|record|sealed|permits|yield)$/;
const tokenizer = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.\d[\d_]*)?[fFdDlL]?)\b|\b[A-Za-z_$][\w$]*\b)/g;

function tokenClass(token: string): string | undefined {
  if (token.startsWith("//") || token.startsWith("/*")) return "code-token--comment";
  if (token.startsWith('"') || token.startsWith("'")) return "code-token--string";
  if (/^\d/.test(token)) return "code-token--number";
  if (keywordPattern.test(token)) return "code-token--keyword";
  if (/^[A-Z][A-Za-z\d_$]*$/.test(token)) return "code-token--type";
  return undefined;
}

export function CodeBlock({ code, languageVersion = 21 }: { code: string; languageVersion?: number }) {
  const [copied, setCopied] = useState(false);
  const tokens = code.split(tokenizer);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="code-block" aria-label={`Java ${languageVersion} 代码`}>
      <header className="code-block__header">
        <span><span className="code-block__dot" /> JAVA {languageVersion}</span>
        <button type="button" className="code-block__copy" onClick={copy} aria-label="复制代码">
          <AppIcon name={copied ? "check" : "copy"} size={14} /> {copied ? "已复制" : "复制"}
        </button>
      </header>
      <div className="code-block__scroll" tabIndex={0} aria-label="可横向滚动的代码">
        <pre><code>{tokens.map((token, index) => {
          const className = tokenClass(token);
          return className ? <span className={className} key={index}>{token}</span> : token;
        })}</code></pre>
      </div>
    </section>
  );
}
