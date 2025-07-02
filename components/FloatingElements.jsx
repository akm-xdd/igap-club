"use client"

export default function FloatingElements() {
  const elements = [
    "{ }", "< />", "( )", "[ ]", "=>", "&&", "||", "!==", "++", "--",
    "??", "?:", "...", "/**/", "//", "#",
  ]

  // Deterministic positions using index-based seeded random
  const getSeededPosition = (index, max) => {
    const seed = index * 1234.5678 % 1
    return seed * max + 5
  }

  const getSeededDuration = (index) => {
    const seed = (index * 9876.543) % 1
    return 6 + seed * 4
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {elements.map((element, index) => (
        <div
          key={index}
          className="absolute text-green-400/15 font-mono text-xl md:text-3xl animate-float-random"
          style={{
            left: `${getSeededPosition(index, 85)}%`,
            top: `${getSeededPosition(index * 2, 85)}%`,
            animationDelay: `${index * 0.8}s`,
            animationDuration: `${getSeededDuration(index)}s`,
          }}
        >
          {element}
        </div>
      ))}
    </div>
  )
}

