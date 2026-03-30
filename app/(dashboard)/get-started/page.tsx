import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"

const steps = [
  { title: "Connect your CRM", description: "Import your customer data from Salesforce, HubSpot, or CSV.", done: true },
  { title: "Connect ad platforms", description: "Link Meta Ads, Google Ads, or other paid channels.", done: true },
  { title: "Run your first enrichment", description: "Enrich your customer profiles with Minerva's 260M+ consumer dataset.", done: false },
  { title: "Build your first audience", description: "Create a predictive or owned audience segment.", done: false },
]

export default function GetStartedPage() {
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
            {steps.map((step, i) => (
              <FadeIn key={i}>
                <div className="mb-3 flex items-start gap-4 rounded-xl border border-border bg-card p-4">
                  {step.done ? <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" /> : <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />}
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${step.done ? "line-through text-muted-foreground" : ""}`}>{step.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {!step.done && (
                    <button className="flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">Start <ArrowRight className="h-3 w-3" /></button>
                  )}
                </div>
              </FadeIn>
            ))}
          </PageTransition>
        </div>
      </div>
    </>
  )
}
