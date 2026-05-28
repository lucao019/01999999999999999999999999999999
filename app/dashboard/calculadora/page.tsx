"use client"

import { useState } from "react"
import {
  Activity,
  Apple,
  Calculator,
  Dumbbell,
  Moon,
  Target,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface PlanoGerado {
  tdee: number
  objetivoCaloriaco: number
  proteina: number
  carboidratos: number
  gorduras: number
  divisaoTreino: string
  volumeSemanal: number
  observacoes: string[]
}

const calcularTDEE = (
  peso: number,
  altura: number,
  idade: number,
  sexo: string,
  atividade: number
): number => {
  let tmb: number

  if (sexo === "masculino") {
    tmb = 10 * peso + 6.25 * altura - 5 * idade + 5
  } else {
    tmb = 10 * peso + 6.25 * altura - 5 * idade - 161
  }

  const fatoresAtividade = [1.2, 1.375, 1.55, 1.725, 1.9]

  return Math.round(tmb * fatoresAtividade[atividade])
}

export default function CalculadoraPage() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    peso: "",
    altura: "",
    sexo: "",
    objetivo: "",
    frequencia: "",
    nivelAtividade: 2,
    sono: "",
    cardio: "",
  })

  const [plano, setPlano] = useState<PlanoGerado | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const atividadeLabels = [
    "Sedentário",
    "Leve (1-2x/sem)",
    "Moderado (3-5x/sem)",
    "Intenso (6-7x/sem)",
    "Atleta",
  ]

  const handleGenerate = async () => {
    setIsCalculating(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    const peso = parseFloat(formData.peso)
    const altura = parseFloat(formData.altura)
    const idade = parseInt(formData.idade)

    const tdee = calcularTDEE(
      peso,
      altura,
      idade,
      formData.sexo,
      formData.nivelAtividade
    )

    let objetivoCaloriaco = tdee
    let proteinaMultiplier = 2

    if (formData.objetivo === "emagrecimento") {
      objetivoCaloriaco = Math.round(tdee * 0.8)
      proteinaMultiplier = 2.2
    }

    if (formData.objetivo === "massa") {
      objetivoCaloriaco = Math.round(tdee * 1.15)
      proteinaMultiplier = 2
    }

    if (formData.objetivo === "definicao") {
      objetivoCaloriaco = Math.round(tdee * 0.85)
      proteinaMultiplier = 2.4
    }

    if (formData.objetivo === "recomposicao") {
      objetivoCaloriaco = Math.round(tdee * 0.95)
      proteinaMultiplier = 2.2
    }

    if (formData.objetivo === "manutencao") {
      objetivoCaloriaco = tdee
      proteinaMultiplier = 2
    }

    const proteina = Math.round(peso * proteinaMultiplier)
    const gorduras = Math.round((objetivoCaloriaco * 0.25) / 9)
    const caloriasRestantes = objetivoCaloriaco - proteina * 4 - gorduras * 9
    const carboidratos = Math.round(caloriasRestantes / 4)

    const divisoesTreino: Record<string, string> = {
      "2x": "Full Body A/B",
      "3x": "Push / Pull / Legs",
      "4x": "Upper / Lower 2x",
      "5x": "PPL + Upper / Lower",
      "6x": "Push / Pull / Legs 2x",
    }

    const frequenciaNumero = parseInt(
      formData.frequencia?.replace("x", "") || "3"
    )

    const volumeSemanal = frequenciaNumero * 15

    const observacoes: string[] = []

    if (formData.sono === "ruim") {
      observacoes.push(
        "Priorize melhorar o sono antes de aumentar volume ou intensidade do treino."
      )
    }

    if (formData.cardio === "nenhum" && formData.objetivo === "emagrecimento") {
      observacoes.push(
        "Considere adicionar 2-3 sessões leves de cardio por semana."
      )
    }

    if (idade > 40) {
      observacoes.push(
        "Dê atenção extra ao aquecimento, mobilidade e controle de progressão."
      )
    }

    if (formData.objetivo === "massa" && formData.frequencia === "2x") {
      observacoes.push(
        "Para ganho de massa, pode ser útil aumentar a frequência para 3-4x por semana."
      )
    }

    setPlano({
      tdee,
      objetivoCaloriaco,
      proteina,
      carboidratos,
      gorduras,
      divisaoTreino: divisoesTreino[formData.frequencia] || "Full Body",
      volumeSemanal,
      observacoes,
    })

    setIsCalculating(false)
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-zinc-950 via-zinc-950 to-red-950/40 p-6 shadow-xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -bottom-24 left-16 h-72 w-72 rounded-full bg-red-900/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              <Calculator className="h-4 w-4" />
              Calculadora
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Calculadora
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                Calcule TDEE, meta calórica, macronutrientes e estrutura base de
                treino para consultoria, aluno ou uso pessoal.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Motor
            </p>
            <p className="mt-1 font-bold text-white">TDEE + Macros + Treino</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulário */}
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold">Dados do Cliente</h2>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Nome do cliente"
                  value={formData.nome}
                  onChange={(event) =>
                    setFormData({ ...formData, nome: event.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="idade">Idade</Label>
                  <Input
                    id="idade"
                    type="number"
                    placeholder="25"
                    value={formData.idade}
                    onChange={(event) =>
                      setFormData({ ...formData, idade: event.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select
                    value={formData.sexo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, sexo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    placeholder="75"
                    value={formData.peso}
                    onChange={(event) =>
                      setFormData({ ...formData, peso: event.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    type="number"
                    placeholder="175"
                    value={formData.altura}
                    onChange={(event) =>
                      setFormData({ ...formData, altura: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>
                  Nível de atividade:{" "}
                  <span className="text-red-400">
                    {atividadeLabels[formData.nivelAtividade]}
                  </span>
                </Label>

                <Slider
                  value={[formData.nivelAtividade]}
                  onValueChange={(value) =>
                    setFormData({ ...formData, nivelAtividade: value[0] })
                  }
                  max={4}
                  step={1}
                  className="py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="objetivo">Objetivo</Label>
                  <Select
                    value={formData.objetivo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, objetivo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                      <SelectItem value="massa">Ganho de massa</SelectItem>
                      <SelectItem value="definicao">Definição</SelectItem>
                      <SelectItem value="recomposicao">Recomposição</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="frequencia">Frequência de treino</Label>
                  <Select
                    value={formData.frequencia}
                    onValueChange={(value) =>
                      setFormData({ ...formData, frequencia: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2x">2x semana</SelectItem>
                      <SelectItem value="3x">3x semana</SelectItem>
                      <SelectItem value="4x">4x semana</SelectItem>
                      <SelectItem value="5x">5x semana</SelectItem>
                      <SelectItem value="6x">6x semana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sono">Sono</Label>
                  <Select
                    value={formData.sono}
                    onValueChange={(value) =>
                      setFormData({ ...formData, sono: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bom">Bom (7-9h)</SelectItem>
                      <SelectItem value="medio">Médio (5-7h)</SelectItem>
                      <SelectItem value="ruim">Ruim (&lt;5h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cardio">Cardio atual</Label>
                  <Select
                    value={formData.cardio}
                    onValueChange={(value) =>
                      setFormData({ ...formData, cardio: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhum">Nenhum</SelectItem>
                      <SelectItem value="leve">1-2x semana</SelectItem>
                      <SelectItem value="moderado">3-4x semana</SelectItem>
                      <SelectItem value="intenso">5+ semana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="mt-4 w-full bg-red-600 hover:bg-red-700"
                onClick={handleGenerate}
                disabled={
                  isCalculating ||
                  !formData.peso ||
                  !formData.altura ||
                  !formData.idade ||
                  !formData.sexo
                }
              >
                {isCalculating ? "Calculando..." : "Calcular plano"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        <div className="space-y-4">
          {plano ? (
            <>
              <Card className="border-red-500/30 bg-card/50">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-500" />
                    <h2 className="text-lg font-bold">Resultado</h2>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-secondary p-4 text-center">
                      <p className="mb-1 text-sm text-muted-foreground">TDEE</p>
                      <p className="text-2xl font-black text-foreground">
                        {plano.tdee}
                      </p>
                      <p className="text-xs text-muted-foreground">kcal/dia</p>
                    </div>

                    <div className="rounded-lg bg-red-500/10 p-4 text-center">
                      <p className="mb-1 text-sm text-muted-foreground">
                        Meta calórica
                      </p>
                      <p className="text-2xl font-black text-red-500">
                        {plano.objetivoCaloriaco}
                      </p>
                      <p className="text-xs text-muted-foreground">kcal/dia</p>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <Apple className="h-4 w-4 text-red-500" />
                    <h3 className="font-bold">Macronutrientes</h3>
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-secondary p-3 text-center">
                      <p className="text-lg font-bold text-foreground">
                        {plano.proteina}g
                      </p>
                      <p className="text-xs text-muted-foreground">Proteína</p>
                    </div>

                    <div className="rounded-lg bg-secondary p-3 text-center">
                      <p className="text-lg font-bold text-foreground">
                        {plano.carboidratos}g
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Carboidratos
                      </p>
                    </div>

                    <div className="rounded-lg bg-secondary p-3 text-center">
                      <p className="text-lg font-bold text-foreground">
                        {plano.gorduras}g
                      </p>
                      <p className="text-xs text-muted-foreground">Gorduras</p>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-red-500" />
                    <h3 className="font-bold">Treino</h3>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-sm text-muted-foreground">Divisão</p>
                      <p className="font-bold text-foreground">
                        {plano.divisaoTreino}
                      </p>
                    </div>

                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-sm text-muted-foreground">
                        Volume semanal
                      </p>
                      <p className="font-bold text-foreground">
                        {plano.volumeSemanal} séries
                      </p>
                    </div>
                  </div>

                  {plano.observacoes.length > 0 && (
                    <>
                      <div className="mb-3 flex items-center gap-2">
                        <Moon className="h-4 w-4 text-red-500" />
                        <h3 className="font-bold">Observações</h3>
                      </div>

                      <ul className="space-y-2">
                        {plano.observacoes.map((obs, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="text-red-500">•</span>
                            {obs}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full">
                Salvar cálculo
              </Button>
            </>
          ) : (
            <Card className="flex min-h-[420px] flex-col items-center justify-center border-border/60 bg-card/40 p-6 text-center">
              <Calculator className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-bold text-foreground">
                Preencha os dados
              </h3>
              <p className="max-w-xs text-sm text-muted-foreground">
                Complete o formulário para calcular TDEE, macros, meta calórica
                e estrutura base de treino.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}