import fs from "node:fs"
import path from "node:path"

const inputPath = path.join(process.cwd(), "imports", "conversations.json")
const outputPath = path.join(process.cwd(), "lib", "data", "monstro-pages.ts")

const folderRules = [
  {
    folder: "biohacker-engine",
    label: "Biohacker Engine",
    keywords: [
      "treino",
      "musculação",
      "musculacao",
      "dieta",
      "macarrão",
      "macarrao",
      "pump",
      "adenosina",
      "testosterona",
      "sangue",
      "rh",
      "mounjaro",
      "tirzepatida",
      "gip",
      "glp",
      "cardio",
      "dor",
      "intercostal",
      "deltoide",
      "hormônio",
      "hormonio",
      "biomecânica",
      "biomecanica",
    ],
  },
  {
    folder: "oficina-tech",
    label: "Oficina Tech",
    keywords: [
      "adb",
      "fastboot",
      "redmi",
      "xiaomi",
      "rom",
      "custom rom",
      "hyperos",
      "robocopy",
      "windows",
      "powershell",
      "driver",
      "android",
      "wo mic",
      "moto g",
      "bateria",
      "parafuso",
      "sharp",
      "pnpm",
      "visual studio code",
      "vscode",
      "terminal",
    ],
  },
  {
    folder: "alunos",
    label: "Alunos",
    keywords: [
      "aluno",
      "wellington",
      "tdee",
      "planilha",
      "maestro",
      "volume de treino",
      "novo aluno",
      "dieta base",
    ],
  },
  {
    folder: "conteudo",
    label: "Conteúdo",
    keywords: [
      "youtube",
      "vídeo",
      "video",
      "roteiro",
      "conteúdo",
      "conteudo",
      "pubg",
      "fortnite",
      "thumbnail",
      "canal",
      "edição",
      "edicao",
      "kill counter",
    ],
  },
  {
    folder: "empresa",
    label: "Empresa",
    keywords: [
      "mei",
      "nota fiscal",
      "monetização",
      "monetizacao",
      "produto digital",
      "empresa",
      "vendas",
      "mercado de skins",
      "skins",
    ],
  },
  {
    folder: "mente-sistema",
    label: "Mente Sistema",
    keywords: [
      "mente",
      "escassez",
      "ego",
      "sombra",
      "arquétipo",
      "arquetipo",
      "disciplina",
      "tentação",
      "tentacao",
      "desapego",
      "frequência",
      "frequencia",
      "inconsciente",
    ],
  },
  {
    folder: "monstro-site",
    label: "Chat-to-Knowledge Pipeline",
    keywords: [
      "Chat-to-Knowledge Pipeline",
      "dashboard",
      "second brain",
      "personal os",
      "biblioteca",
      "pastas",
      "projeto",
      "site",
      "layout",
      "login",
    ],
  },
]

const folderLabels = Object.fromEntries(
  folderRules.map((rule) => [rule.folder, rule.label])
)

function slugify(text) {
  return String(text || "sem-titulo")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "sem-titulo"
}

function getMessageText(message) {
  const content = message?.content

  if (!content) return ""

  if (Array.isArray(content.parts)) {
    return content.parts
      .filter((part) => typeof part === "string")
      .join("\n")
      .trim()
  }

  if (typeof content.text === "string") {
    return content.text.trim()
  }

  return ""
}

function getConversationMessages(conversation) {
  return Object.values(conversation.mapping || {})
    .map((node) => node?.message)
    .filter(Boolean)
    .filter((message) => {
      const role = message?.author?.role
      return role === "user" || role === "assistant"
    })
    .map((message) => ({
      role: message.author.role,
      text: getMessageText(message),
      time: message.create_time || conversation.create_time || 0,
    }))
    .filter((message) => message.text && message.text.length > 2)
    .sort((a, b) => a.time - b.time)
}

function classifyFolder(text) {
  const normalized = text.toLowerCase()

  let best = {
    folder: "biblioteca",
    score: 0,
  }

  for (const rule of folderRules) {
    const score = rule.keywords.reduce((total, keyword) => {
      return normalized.includes(keyword.toLowerCase()) ? total + 1 : total
    }, 0)

    if (score > best.score) {
      best = {
        folder: rule.folder,
        score,
      }
    }
  }

  return best.folder
}

function detectType(text) {
  const normalized = text.toLowerCase()

  if (
    normalized.includes("passo a passo") ||
    normalized.includes("tutorial") ||
    normalized.includes("comando")
  ) {
    return "tutorial"
  }

  if (
    normalized.includes("checklist") ||
    normalized.includes("[ ]") ||
    normalized.includes("[x]")
  ) {
    return "checklist"
  }

  if (
    normalized.includes("roteiro") ||
    normalized.includes("vídeo") ||
    normalized.includes("video")
  ) {
    return "roteiro"
  }

  if (
    normalized.includes("caso") ||
    normalized.includes("aluno") ||
    normalized.includes("diagnóstico")
  ) {
    return "estudo-caso"
  }

  return "explicacao"
}

function getTitle(conversation, messages) {
  const rawTitle = conversation.title || conversation.name

  if (rawTitle && rawTitle.trim()) {
    return rawTitle.trim()
  }

  const firstUser = messages.find((message) => message.role === "user")

  return firstUser?.text?.split("\n")?.[0]?.slice(0, 90) || "Conversa importada"
}

function pickContent(messages) {
  const assistantMessages = messages
    .filter((message) => message.role === "assistant")
    .map((message) => message.text)

  const userMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => message.text)

  const bestAssistant = assistantMessages.sort((a, b) => b.length - a.length)[0]
  const bestUser = userMessages.sort((a, b) => b.length - a.length)[0]

  const content = bestAssistant || bestUser || "Conteúdo importado da conversa."

  return content.length > 4500
    ? `${content.slice(0, 4500)}\n\n[conteúdo cortado para caber na página]`
    : content
}

function extractProblem(messages) {
  const firstUser = messages.find((message) => message.role === "user")?.text || ""

  return firstUser.length > 320
    ? `${firstUser.slice(0, 320)}...`
    : firstUser
}

function makePage(conversation, index) {
  const messages = getConversationMessages(conversation)
  const title = getTitle(conversation, messages)

  const allText = `${title}\n${messages.map((message) => message.text).join("\n")}`

  const folder = classifyFolder(allText)

  const createdAt = new Date(
    (conversation.create_time || Date.now() / 1000) * 1000
  ).toISOString()

  return {
    id: `${slugify(title)}-${index + 1}`,
    title,
    folder,
    folderLabel: folderLabels[folder] || "Biblioteca",
    source: "chatgpt",
    type: detectType(allText),
    status: "importado",
    createdAt,
    problem: extractProblem(messages),
    context: `Conversa importada do ChatGPT para a pasta ${
      folderLabels[folder] || "Biblioteca"
    }.`,
    content: pickContent(messages),
    practical: "Transformar essa conversa em página limpa do Chat-to-Knowledge Pipeline.",
    connections: [],
  }
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Arquivo não encontrado: ${inputPath}`)
    console.error("Crie a pasta imports e coloque conversations.json dentro dela.")
    process.exit(1)
  }

  const conversations = JSON.parse(fs.readFileSync(inputPath, "utf8"))

  const pages = conversations
    .map(makePage)
    .filter((page) => page.title && page.content)

  const folders = [...new Set(pages.map((page) => page.folder))].map(
    (folder) => ({
      id: folder,
      label: folderLabels[folder] || folder,
      total: pages.filter((page) => page.folder === folder).length,
    })
  )

  const output = `export type MonstroPage = {
  id: string
  title: string
  folder: string
  folderLabel: string
  source: "chatgpt" | "gemini" | "manual"
  type: string
  status: string
  createdAt: string
  problem: string
  context: string
  content: string
  practical: string
  connections: string[]
}

export const monstroFolders = ${JSON.stringify(folders, null, 2)}

export const monstroPages: MonstroPage[] = ${JSON.stringify(pages, null, 2)}

export function getPagesByFolder(folder: string) {
  return monstroPages.filter((page) => page.folder === folder)
}

export function getPageById(id: string) {
  return monstroPages.find((page) => page.id === id)
}

export function searchMonstroPages(query: string) {
  const normalizedQuery = query.toLowerCase().trim()

  if (!normalizedQuery) return monstroPages

  return monstroPages.filter((page) => {
    return [
      page.title,
      page.folderLabel,
      page.type,
      page.status,
      page.problem,
      page.context,
      page.content,
      page.practical,
      page.connections.join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  })
}
`

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, output, "utf8")

  console.log("Importação concluída.")
  console.log(`Conversas lidas: ${conversations.length}`)
  console.log(`Páginas geradas: ${pages.length}`)
  console.log(`Arquivo criado: ${outputPath}`)
}

main()