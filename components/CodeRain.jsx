"use client"

import { useEffect, useState } from "react"

export default function CodeRain() {
  const [drops, setDrops] = useState([])

  useEffect(() => {
    const codeSnippets = [
      "const", "function", "=>", "{}", "[]", "()", "if", "else", "for", "while",
      "return", "import", "export", "class", "async", "await", "try", "catch",
      "console.log", "useState", "useEffect", "map", "filter", "reduce", "01010",
      "null", "undefined", "true", "false", "&&", "||", "===", "git", "npm",
      "yarn", "node", "react", "next", "js", "ts", "css", "html", "api", "json",
      "http", "dev", "def", "print()", "range()", "len()", "lambda", "self",
      "__init__", "pip", "numpy", "pandas", "import *", "elif", "#include",
      "std::", "cout", "cin", "int main()", "vector", "string", "new", "delete",
      "nullptr", "using namespace", "public", "private", "static", "void",
      "String", "System.out", "ArrayList", "extends", "implements", "throws",
      "final", "malloc", "free", "sizeof", "struct", "typedef", "enum",
      "switch", "case", "break", "continue",
    ]

    const newDrops = []

    for (let i = 0; i < 100; i++) {
      newDrops.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        size: Math.random() * 0.4 + 0.6,
      })
    }

    setDrops(newDrops)

    const interval = setInterval(() => {
      setDrops((prevDrops) =>
        prevDrops.map((drop) => ({
          ...drop,
          y: drop.y > 105 ? -10 : drop.y + drop.speed,
          text: Math.random() > 0.992 ? codeSnippets[Math.floor(Math.random() * codeSnippets.length)] : drop.text,
        })),
      )
    }, 80)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute font-mono text-green-400/60 select-none transition-all duration-300"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            opacity: drop.opacity,
            fontSize: `${drop.size}rem`,
            transform: "translateX(-50%)",
          }}
        >
          {drop.text}
        </div>
      ))}
    </div>
  )
}