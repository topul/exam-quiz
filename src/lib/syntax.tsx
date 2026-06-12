import Prism from "prismjs";
import "prismjs/components/prism-python";
import type { ReactNode } from "react";

// Cache the grammar for reuse
let pythonGrammar: Prism.Grammar | null = null;
function getGrammar(): Prism.Grammar {
  if (!pythonGrammar) {
    pythonGrammar = Prism.languages.extend("python", {});
  }
  return pythonGrammar;
}

/**
 * Tokenize Python code with Prism, then render as React elements.
 * {N} markers (where N is a number) are detected and rendered via
 * the `renderBlank` callback instead of as text.
 */
export function highlightPython(
  code: string,
  renderBlank: (id: number) => ReactNode
): ReactNode[] {
  const grammar = getGrammar();
  const tokens = Prism.tokenize(code, grammar);
  let keyIdx = 0;

  function renderTokenNodes(token: string | Prism.Token): ReactNode[] {
    if (typeof token === "string") {
      // Raw text token — no syntax type, render with blank detection
      return renderTextWithBlanks(token, "", (node) => {
        keyIdx++;
        return node;
      });
    }

    if (Array.isArray(token.content)) {
      return token.content.flatMap((child) =>
        typeof child === "string"
          ? renderTextWithBlanks(child, token.type, (node) => {
              keyIdx++;
              return node;
            })
          : renderTokenNodes(child)
      );
    }

    // Single nested token
    if (typeof token.content !== "string") {
      return renderTokenNodes(token.content as Prism.Token);
    }

    // Leaf string token with a syntax type
    return renderTextWithBlanks(token.content, token.type, (node) => {
      keyIdx++;
      return node;
    });
  }

  function renderTextWithBlanks(
    text: string,
    tokenType: string,
    wrap: (node: ReactNode) => ReactNode
  ): ReactNode[] {
    const regex = /\{(\d+)\}/g;
    const nodes: ReactNode[] = [];
    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = regex.exec(text)) !== null) {
      // Text before the blank marker
      if (m.index > lastIdx) {
        nodes.push(
          wrap(
            <span key={`t-${keyIdx}-${lastIdx}`} className={`token ${tokenType}`}>
              {text.slice(lastIdx, m.index)}
            </span>
          )
        );
      }
      // The blank marker
      nodes.push(renderBlank(parseInt(m[1])));
      lastIdx = m.index + m[0].length;
    }

    // Remaining text after last marker
    if (lastIdx < text.length) {
      nodes.push(
        wrap(
          <span key={`t-${keyIdx}-${lastIdx}`} className={`token ${tokenType}`}>
            {text.slice(lastIdx)}
          </span>
        )
      );
    }

    return nodes;
  }

  return tokens.flatMap((token) => renderTokenNodes(token));
}
