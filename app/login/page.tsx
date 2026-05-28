import { CodeXml } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-8 text-white sm:px-6">
      {/* Fundo animado opcional no mobile */}
      <img
        src="/login-bg.gif"
        alt="Fundo animado"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-100"
      />

      {/* Camadas de fundo */}
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950/90 to-red-950/50" />
      <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-red-900/20 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px]" />

      {/* Card central */}
      <section className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8 space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/40 bg-red-600/20 shadow-lg shadow-red-900/40">
  <CodeXml className="h-8 w-8 text-red-500" />
</div>

            <div>
              <div className="mx-auto mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
                Acesso
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white">
                Entrar
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Acesse sua conta no Chat-to-Knowledge Pipeline.
              </p>
            </div>
          </div>

          <LoginForm />

          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="text-center text-xs leading-relaxed text-zinc-500">
              Ao continuar, você concorda com nossos{" "}
              <a href="#" className="text-red-400 hover:underline">
                Termos de Uso
              </a>{" "}
              e{" "}
              <a href="#" className="text-red-400 hover:underline">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}