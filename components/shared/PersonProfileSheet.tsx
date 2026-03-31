"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Home, Users, DollarSign, Clock, Ticket, Heart } from "lucide-react"
import type { Person } from "@/lib/data/persons"

interface PersonProfileSheetProps { person: Person | null; open: boolean; onClose: () => void }

function ScoreBar({ label, score, variant = "default" }: { label: string; score: number; variant?: "default" | "danger" }) {
  const pct = Math.round(score * 100)
  const color = variant === "danger" ? pct > 50 ? "bg-red-500" : "bg-red-300" : pct > 70 ? "bg-emerald-500" : pct > 40 ? "bg-amber-400" : "bg-muted-foreground/30"
  return (<div className="mn-profile-stack space-y-1"><div className="mn-profile-row-2 flex items-center justify-between"><span className="mn-profile-el-3 text-xs text-muted-foreground">{label}</span><span className="mn-profile-el-4 text-xs font-semibold tabular-nums">{pct}</span></div><div className="mn-profile-el-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} /></div></div>)
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (<div className="mn-profile-group-6 flex items-center gap-3 py-1.5"><Icon className="mn-profile-el-7 h-3.5 w-3.5 text-muted-foreground shrink-0" /><span className="mn-profile-el-8 text-xs text-muted-foreground w-20 shrink-0">{label}</span><span className="mn-profile-el-9 text-xs font-medium truncate">{value}</span></div>)
}

const statusColors: Record<string, string> = { active_fan: "bg-emerald-500/10 text-emerald-500", season_ticket_holder: "bg-blue-500/10 text-blue-500", lapsed: "bg-red-500/10 text-red-500", prospect: "bg-amber-500/10 text-amber-500", anonymous: "bg-muted text-muted-foreground" }
const lifecycleColors: Record<string, string> = { loyal: "bg-emerald-500/10 text-emerald-500", engaged: "bg-blue-500/10 text-blue-500", growing: "bg-cyan-500/10 text-cyan-500", at_risk: "bg-red-500/10 text-red-500", acquisition: "bg-amber-500/10 text-amber-500" }

export function PersonProfileSheet({ person, open, onClose }: PersonProfileSheetProps) {
  if (!person) return null
  const initials = `${person.firstName[0]}${person.lastName[0]}`
  const totalRevenue = person.tickets.reduce((sum, t) => sum + t.revenue, 0)

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent className="mn-profile-sheet w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="mn-profile-divider sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm px-6 py-4">
          <div className="mn-profile-group-11 flex items-center gap-4">
            <Avatar className="mn-profile-el-12 h-12 w-12 border"><AvatarFallback className="mn-profile-el-13 bg-primary/10 text-sm font-bold text-primary">{initials}</AvatarFallback></Avatar>
            <div className="mn-profile-el-14 flex-1 min-w-0">
              <SheetHeader className="p-0"><SheetTitle className="mn-profile-el-15 text-lg font-semibold">{person.firstName} {person.lastName}</SheetTitle></SheetHeader>
              <div className="mn-profile-group-16 flex items-center gap-2 mt-1">
                <Badge className={`text-[10px] ${statusColors[person.fanStatus] ?? "bg-secondary text-secondary-foreground"}`}>{person.fanStatus.replace(/_/g, " ")}</Badge>
                <Badge className={`text-[10px] ${lifecycleColors[person.lifecycleStage] ?? "bg-secondary text-secondary-foreground"}`}>{person.lifecycleStage.replace(/_/g, " ")}</Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="mn-profile-stack px-6 py-5 space-y-6">
          <div className="mn-profile-group-18 flex items-center gap-4">
            <div className="mn-profile-el-19 flex-1"><div className="mn-profile-row-20 flex items-center justify-between mb-1"><span className="mn-profile-label-21 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Identity Confidence</span><span className="mn-profile-el-22 text-xs font-bold tabular-nums">{Math.round(person.identityConfidence * 100)}%</span></div><Progress value={person.identityConfidence * 100} className="h-1.5" /></div>
            <div className="mn-profile-el-23 flex-1"><div className="mn-profile-row-24 flex items-center justify-between mb-1"><span className="mn-profile-label-25 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Profile Completeness</span><span className="mn-profile-el-26 text-xs font-bold tabular-nums">{Math.round(person.profileCompleteness * 100)}%</span></div><Progress value={person.profileCompleteness * 100} className="h-1.5" /></div>
          </div>
          <Separator />
          <div><h4 className="mn-profile-label-27 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Contact</h4>{person.contacts.map((c, i) => (<InfoRow key={i} icon={c.type === "email" ? Mail : Phone} label={c.type} value={c.value} />))}<InfoRow icon={MapPin} label="Location" value={`${person.city}, ${person.state} ${person.zip}`} /><InfoRow icon={Clock} label="Last seen" value={new Date(person.lastSeenAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} /></div>
          <Separator />
          <div><h4 className="mn-profile-label-28 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Household</h4><InfoRow icon={DollarSign} label="Income" value={person.household.incomeBand} /><InfoRow icon={Home} label="Housing" value={person.household.homeownership} /><InfoRow icon={Users} label="Size" value={`${person.household.householdSize} ${person.household.hasChildren ? "· Has children" : ""}`} /><InfoRow icon={MapPin} label="Stadium" value={`${person.household.distanceToStadium} miles`} /></div>
          <Separator />
          <div><h4 className="mn-profile-label-29 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Propensity Scores</h4><div className="mn-profile-stack space-y-3"><ScoreBar label="Ticket Purchase" score={person.scores.ticketBuy} /><ScoreBar label="Renewal" score={person.scores.renewal} /><ScoreBar label="Premium Upgrade" score={person.scores.premium} /><ScoreBar label="Churn Risk" score={person.scores.churn} variant="danger" /></div></div>
          <Separator />
          <div><h4 className="mn-profile-label-31 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Affinities & Interests</h4><div className="mn-profile-group-32 flex flex-wrap gap-1.5">{person.affinities.map((a, i) => (<Badge key={i} variant="outline" className="mn-profile-el-33 text-[10px] gap-1"><Heart className="mn-profile-el-34 h-2.5 w-2.5" />{a.name}<span className="mn-profile-el-35 text-muted-foreground tabular-nums">{Math.round(a.score * 100)}</span></Badge>))}</div></div>
          {person.tickets.length > 0 && (<><Separator /><div><div className="mn-profile-row-36 flex items-center justify-between mb-2"><h4 className="mn-profile-label-37 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Ticket History</h4><span className="mn-profile-el-38 text-xs font-semibold text-emerald-400 tabular-nums">${totalRevenue.toLocaleString()}</span></div><div className="mn-profile-stack space-y-2">{person.tickets.map((t, i) => (<div key={i} className="mn-profile-row-40 flex items-center justify-between rounded-lg border px-3 py-2"><div className="mn-profile-group-41 flex items-center gap-2"><Ticket className="mn-profile-el-42 h-3.5 w-3.5 text-muted-foreground" /><div><p className="mn-profile-el-43 text-xs font-medium">{t.product}</p><p className="mn-profile-el-44 text-[10px] text-muted-foreground">{t.seatCategory} · {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p></div></div><div className="mn-profile-el-45 text-right"><span className="mn-profile-el-46 text-xs font-semibold tabular-nums">${t.revenue.toLocaleString()}</span>{t.isPremium && <Badge className="mn-profile-el-47 ml-2 bg-amber-500/10 text-amber-500 text-[8px]">PREMIUM</Badge>}</div></div>))}</div></div></>)}
        </div>
      </SheetContent>
    </Sheet>
  )
}
