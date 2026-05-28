import { CodeXml } from "lucide-react"

export function BrandPanel() {
  return (
    <div className="relative hidden min-h-screen w-full overflow-hidden border-r border-white/10 bg-black lg:flex">
      {/* GIF de fundo */}
      <img
        src="/login-bg.gif"
        alt="Fundo animado"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Camadas visuais */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-red-950/60" />

      {/* Luzes */}
      <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-red-600/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-red-900/30 blur-3xl" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px]" />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[560px] flex-col px-10 py-12">
        {/* Topo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/50 bg-red-600/20 text-red-500 shadow-lg shadow-red-900/40">
            <CodeXml className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-xl font-black leading-none tracking-tight text-white">
              9999999999999
            </h1>
            <p className="mt-1 text-xs uppercase tracking-[0.4em] text-red-400">
              Personal OS
            </p>
          </div>
        </div>

        {/* Centro */}
        <div className="flex flex-1 items-center">
          <div className="w-full space-y-6">
            <div className="inline-flex max-w-fit rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-red-400">
              Central de Projetos
            </div>

            <h2 className="max-w-[460px] text-5xl font-black leading-[1.12] tracking-tight text-white">
              Suas pesquisas virando sistema.
            </h2>

            <p className="max-w-[430px] text-lg leading-relaxed text-zinc-300">
              Organize conversas, estudos, projetos, Consultoria, conteúdo e ideias
              em uma plataforma própria.
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm text-zinc-400">
          <span>Second Brain</span>
          <span>Knowledge Base</span>
          <span>Project Hub</span>
        </div>
      </div>
    </div>
  )
}