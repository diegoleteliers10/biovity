import { type DOMNode, type Element, htmlToDOM } from "html-react-parser"

function nodePlainText(
  node: DOMNode | Element["children"][number] | Element["children"][number]
): string {
  if (node.type === "text") return node.data
  if (node.type === "script" || node.type === "style") return ""
  if (node.type !== "tag") return ""
  if (node.name === "script" || node.name === "style") return ""
  const text = node.children.map(nodePlainText).join("")
  return /^(address|article|aside|blockquote|br|dd|div|dl|dt|fieldset|figcaption|figure|footer|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|table|td|th|tr|ul)$/i.test(
    node.name
  )
    ? ` ${text} `
    : text
}

export function explanationPlainText(value: string): string {
  return htmlToDOM(value).map(nodePlainText).join("").replace(/\s+/gu, " ").trim()
}

function meaningfulToken(token: string): boolean {
  return (
    token.length > 1 &&
    !new Set(
      "a al algo algunos ante antes aquí así aunque bajo bien cada como con contra cual cuando de del desde donde dos el ella ellos en entre era es esa ese eso esta estar este esto estos fue ha hacia hasta hay la las le les lo los más me mi muy ni no nos o otra otro para pero por porque que qué quien se ser si sí sin sobre son su sus tal tanto te tener tiene todo todos tu un una uno unos y ya experiencia conocimiento conocimientos manejo uso habilidad habilidades capacidad requiere requerido requerida desarrollo trabajo trabajar candidato candidata perfil evidencia requisito requisitos tiene cuenta muestra demuestra menciona indica describe según".split(
        " "
      )
    ).has(token.toLocaleLowerCase("es"))
  )
}

export function evidenceHighlightParts({
  text,
  claim,
  format = "html",
}: {
  text: string
  claim: string
  format?: "plain-text" | "html"
}): { text: string; highlighted: boolean; start: number }[] {
  const plainText = format === "plain-text" ? text : explanationPlainText(text)
  const claimTokens = new Set(
    (
      explanationPlainText(claim).match(/[\p{L}\p{N}]+(?:[./-][\p{L}\p{N}]+)*(?:\+{1,2}|#)?/gu) ??
      []
    )
      .filter(meaningfulToken)
      .map((token) => token.toLocaleLowerCase("es"))
  )
  const parts: { text: string; highlighted: boolean; start: number }[] = []
  let offset = 0
  for (const match of plainText.matchAll(/[\p{L}\p{N}]+(?:[./-][\p{L}\p{N}]+)*(?:\+{1,2}|#)?/gu)) {
    if (!claimTokens.has(match[0].toLocaleLowerCase("es"))) continue
    if (match.index > offset)
      parts.push({ text: plainText.slice(offset, match.index), highlighted: false, start: offset })
    parts.push({ text: match[0], highlighted: true, start: match.index })
    offset = match.index + match[0].length
  }
  if (offset < plainText.length)
    parts.push({ text: plainText.slice(offset), highlighted: false, start: offset })
  return parts
}
