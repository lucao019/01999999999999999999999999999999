"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, LogOut } from "lucide-react"

import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [currentEmail, setCurrentEmail] = useState("")
  const [hasSession, setHasSession] = useState(false)

  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function checkSession() {
      const savedEmail = window.localStorage.getItem("monstro:last-email")

      if (savedEmail) {
        setEmail(savedEmail)
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setHasSession(false)
        setIsCheckingSession(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        await supabase.auth.signOut()
        setHasSession(false)
        setIsCheckingSession(false)
        return
      }

      if (!user.email_confirmed_at) {
        await supabase.auth.signOut()
        setHasSession(false)
        setError("Confirme seu email antes de entrar.")
        setIsCheckingSession(false)
        return
      }

      setCurrentEmail(user.email || "")
      setHasSession(true)
      setIsCheckingSession(false)
    }

    checkSession()
  }, [])

  async function handleUseCurrentSession() {
    router.push("/timeline")
  }

  async function handleChangeAccount() {
    setIsLoading(true)

    await supabase.auth.signOut()

    window.localStorage.removeItem("monstro:last-email")

    setEmail("")
    setPassword("")
    setCurrentEmail("")
    setHasSession(false)
    setError("")
    setIsLoading(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setError("")
    setIsLoading(true)

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanPassword) {
      setError("Preencha email e senha.")
      setIsLoading(false)
      return
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    })

    if (loginError) {
      if (
        loginError.message.toLowerCase().includes("email not confirmed") ||
        loginError.message.toLowerCase().includes("not confirmed")
      ) {
        setError("Confirme seu email antes de entrar.")
      } else {
        setError("Email ou senha incorretos.")
      }

      setIsLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email_confirmed_at) {
      await supabase.auth.signOut()
      setError("Confirme seu email antes de entrar.")
      setIsLoading(false)
      return
    }

    window.localStorage.setItem("monstro:last-email", cleanEmail)

    setIsLoading(false)
    router.push("/timeline")
  }

  if (isCheckingSession) {
    return (
      <div className="w-full max-w-sm rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">
        Verificando sessão...
      </div>
    )
  }

  if (hasSession) {
    return (
      <div className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-card/40 p-5">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Você já está logado como:</p>

          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm font-medium text-green-400">
            {currentEmail}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleUseCurrentSession}
          className="h-12 w-full bg-primary text-base font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
        >
          Entrar com esta conta
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleChangeAccount}
          disabled={isLoading}
          className="h-12 w-full gap-2"
        >
          <LogOut className="h-4 w-4" />
          Trocar conta
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium text-foreground">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-medium text-foreground">
          Senha
        </Label>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 border-border bg-input pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            disabled={isLoading}
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-400"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="h-12 w-full bg-primary text-base font-bold uppercase tracking-wider text-primary-foreground transition-all duration-200 hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <Link
          href="/recuperar-senha"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Esqueceu a senha?
        </Link>

        <Link
          href="/cadastro"
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Criar conta
        </Link>
      </div>
    </form>
  )
}