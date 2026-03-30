import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"

const steps = [
  { title: "Connect your CRM", description: "Import your customer data from Salesforce, HubSpot, or CSV.", done: true },
  { title: "Connect ad platforms", description: "Link Meta Ads, Google Ads, or other paid channels.", done: true },
  { title: "Run your first enrichment", description: "Enrich your customer profiles with Minerva's 260M+ consumer dataset.", done: false },
  { title: "Build your first audience", description: "Create a predictive or owned audience segment.", done: false },
]

export default function GetStartedPage() {
  const completed = steps.filter((s) => s.done).length
  return (
    <>
      <PageHeader breadcrumb="Get Started" title="Get Started" subtitle="Complete these steps to get the most out of Minerva." />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mb-6">
              <h1 className="text-[28px] font-semibold tracking-tight">Get Started</h1>
              <p className="mt-1 text-sm text-muted-foreground">Complete these steps to get the most out of Minerva.</p>
            </FadeIn>
            <FadeIn>
              <div className="mx-auto max-w-xl">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">{completed} of {steps.length} complete</Badge>
                  <span className="text-xs text-muted-foreground tabular-nums">{Math.round((completed / steps.length) * 100)}%</span>
                </div>
                <Progress value={(completed / steps.length) * 100} className="mb-6 h-2" />
              </div>
            </FadeIn>
            <div className="mx-auto max-w-xl space-y-3">
              {steps.map((step, i) => (
                <FadeIn key={i}>
                  <Card>
                    <CardContent className="flex items-start gap-4 p-4">
                      {step.done ? <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />}
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${step.done ? "line-through text-muted-foreground" : ""}`}>{step.title}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                      </div>
                      {!step.done && (
                        <Button variant="outline" size="sm">Start <ArrowRight className="ml-1 h-3 w-3" /></Button>
                      )}
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
