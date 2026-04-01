"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { Mail, Phone, MapPin, Building2, Calendar, User2, Briefcase, Sparkles, Ticket } from "lucide-react"
import type { Person } from "@/lib/data/persons"

interface PersonProfileSheetProps { person: Person | null; open: boolean; onClose: () => void }

// Mock address history for richer demo
const mockAddresses = [
  { address: "1420 NW 2nd Ave, Miami, FL 33136", status: "Current", date: "Jan 2023 – Present", type: null, value: null },
  { address: "8900 SW 107th Ave, Miami, FL 33176", status: null, date: "Mar 2020 – Dec 2022", type: "Rented", value: "$2,100/mo" },
  { address: "3200 Collins Ave, Miami Beach, FL 33140", status: null, date: "Jun 2018 – Feb 2020", type: "Rented", value: "$1,850/mo" },
]

function InfoCell({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="mn-profile-info-cell">
      <p className="mn-profile-info-label text-[11px] text-muted-foreground mb-0.5">{label}</p>
      <div className="mn-profile-info-value flex items-center gap-1.5">
        {icon}
        <span className="mn-profile-info-text text-[14px] font-medium">{value}</span>
      </div>
    </div>
  )
}

export function PersonProfileSheet({ person, open, onClose }: PersonProfileSheetProps) {
  if (!person) return null
  const initials = `${person.firstName[0]}${person.lastName[0]}`
  const primaryEmail = person.contacts.find(c => c.type === "email" && c.isPrimary)
  const otherEmails = person.contacts.filter(c => c.type === "email" && !c.isPrimary)
  const primaryPhone = person.contacts.find(c => c.type === "phone" && c.isPrimary)
  const otherPhones = person.contacts.filter(c => c.type === "phone" && !c.isPrimary)

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent className="mn-profile-sheet w-full sm:max-w-3xl overflow-y-auto p-0 [&>button]:hidden" side="right">
        <div className="mn-profile-content">
          {/* Breadcrumb */}
          <div className="mn-profile-breadcrumb px-6 pt-4 pb-2 text-[11px] text-muted-foreground">
            Person Search › Result › <span className="text-foreground/70">{person.firstName} {person.lastName}</span>
          </div>

          {/* Header */}
          <div className="mn-profile-header px-6 pb-4 flex items-center gap-4">
            <Avatar className="mn-profile-avatar h-14 w-14 border">
              <AvatarFallback className="mn-profile-avatar-text bg-primary/10 text-lg font-bold text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="mn-profile-header-info">
              <div className="mn-profile-header-name flex items-center gap-2">
                <h1 className="mn-profile-name text-[22px] font-semibold tracking-tight">{person.firstName} {person.lastName}</h1>

              </div>
              <p className="mn-profile-subtitle text-[13px] text-muted-foreground">{person.jobTitle} · {person.city}, {person.state}</p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="mn-profile-body px-6 pb-6 grid grid-cols-[1fr_300px] gap-4">
            {/* Left column */}
            <div className="mn-profile-left space-y-4">
              {/* Personal Information */}
              <FeatureCard className="mn-profile-personal-info p-5">
                <h3 className="mn-profile-section-title flex items-center gap-2 text-[13px] font-semibold mb-4">
                  <User2 className="h-4 w-4 text-muted-foreground" /> Personal Information
                </h3>
                <div className="mn-profile-info-grid grid grid-cols-4 gap-4">
                  <InfoCell label="Age" value={String(person.age)} />
                  <InfoCell label="Gender" value={person.gender === "female" ? "♀ Female" : person.gender === "male" ? "♂ Male" : "—"} />
                  <InfoCell label="Marital Status" value="—" />
                  <InfoCell label="Children" value={person.household.hasChildren ? "Yes" : "—"} />
                  <InfoCell label="Employment Status" value="Active" />
                  <InfoCell label="Estimated Income" value={person.household.incomeBand} />
                  <InfoCell label="Estimated Wealth" value={person.household.netWorthBand} />
                  <InfoCell label="Current Location" value={`${person.city}, ${person.state}`} icon={<MapPin className="h-3 w-3 text-muted-foreground" />} />
                </div>
              </FeatureCard>

              {/* Experience */}
              <FeatureCard className="mn-profile-experience p-5">
                <h3 className="mn-profile-section-title flex items-center gap-2 text-[13px] font-semibold mb-4">
                  <Briefcase className="h-4 w-4 text-muted-foreground" /> Experience
                </h3>
                <div className="mn-profile-exp-card flex items-start gap-3">
                  <div className="mn-profile-exp-icon h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mn-profile-exp-info">
                    <p className="mn-profile-exp-title text-[14px] font-semibold">{person.jobTitle}</p>
                    <p className="mn-profile-exp-company text-[13px] text-muted-foreground">{person.company}</p>
                    <div className="mn-profile-exp-tags flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="outline" className="mn-profile-exp-tag text-[10px] bg-primary/5 border-primary/20 text-primary">Current</Badge>
                      <Badge variant="outline" className="mn-profile-exp-tag text-[10px]">Full-Time</Badge>
                      <Badge variant="outline" className="mn-profile-exp-tag text-[10px]">{person.household.incomeBand}</Badge>
                    </div>
                    <p className="mn-profile-exp-date flex items-center gap-1 text-[11px] text-muted-foreground mt-2">
                      <Calendar className="h-3 w-3" /> Jan 2020 – Present
                    </p>
                  </div>
                </div>
              </FeatureCard>

              {/* Address History */}
              <FeatureCard className="mn-profile-addresses p-5">
                <h3 className="mn-profile-section-title flex items-center gap-2 text-[13px] font-semibold mb-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" /> Address History
                </h3>
                <div className="mn-profile-addr-list space-y-4">
                  {mockAddresses.map((addr, i) => (
                    <div key={i} className="mn-profile-addr-item">
                      <p className="mn-profile-addr-text text-[13px] font-medium">{addr.address}</p>
                      <div className="mn-profile-addr-meta flex items-center gap-2 mt-1">
                        {addr.status && <Badge variant="outline" className="mn-profile-addr-badge text-[10px] bg-primary/5 border-primary/20 text-primary">{addr.status}</Badge>}
                        {addr.type && <Badge variant="outline" className="mn-profile-addr-type text-[10px]">{addr.type}</Badge>}
                        {addr.value && <span className="mn-profile-addr-value text-[11px] text-muted-foreground">{addr.value}</span>}
                      </div>
                      <p className="mn-profile-addr-date flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" /> {addr.date}
                      </p>
                      {i < mockAddresses.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </FeatureCard>
            </div>

            {/* Right column (sidebar) */}
            <div className="mn-profile-right space-y-4">
              {/* Contact with AI CTA */}
              <button className="mn-profile-cta w-full flex items-center justify-center gap-2 rounded-lg bg-sky-500/90 hover:bg-sky-500 text-white text-[13px] font-semibold py-3 px-4 transition-colors">
                <Sparkles className="h-4 w-4" /> Contact with AI
              </button>
              {/* Email Addresses */}
              <FeatureCard className="mn-profile-emails p-4">
                <h3 className="mn-profile-section-title flex items-center gap-2 text-[12px] font-semibold mb-3">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Addresses
                </h3>
                <div className="mn-profile-email-list space-y-3">
                  {primaryEmail && (
                    <div className="mn-profile-email-row flex items-center justify-between">
                      <span className="mn-profile-email-value text-[13px] truncate">{primaryEmail.value}</span>
                      <div className="mn-profile-email-badges flex gap-1 shrink-0 ml-2">
                        <Badge className="mn-profile-badge-primary text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/20">✦ Primary</Badge>
                        <Badge variant="outline" className="mn-profile-badge-type text-[9px]">Personal</Badge>
                      </div>
                    </div>
                  )}
                  {otherEmails.map((e, i) => (
                    <div key={i} className="mn-profile-email-row flex items-center justify-between">
                      <span className="mn-profile-email-value text-[13px] text-muted-foreground truncate">{e.value}</span>
                      <Badge variant="outline" className="mn-profile-badge-type text-[9px] shrink-0 ml-2">Work</Badge>
                    </div>
                  ))}
                </div>
              </FeatureCard>

              {/* Phone Numbers */}
              <FeatureCard className="mn-profile-phones p-4">
                <h3 className="mn-profile-section-title flex items-center gap-2 text-[12px] font-semibold mb-3">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone Numbers
                </h3>
                <div className="mn-profile-phone-list space-y-3">
                  {primaryPhone && (
                    <div className="mn-profile-phone-row flex items-center justify-between">
                      <span className="mn-profile-phone-value text-[13px]">{primaryPhone.value}</span>
                      <div className="mn-profile-phone-badges flex gap-1 shrink-0 ml-2">
                        <Badge className="mn-profile-badge-primary text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/20">✦ Primary</Badge>
                        <Badge variant="outline" className="mn-profile-badge-type text-[9px]">Mobile</Badge>
                      </div>
                    </div>
                  )}
                  {otherPhones.map((ph, i) => (
                    <div key={i} className="mn-profile-phone-row flex items-center justify-between">
                      <span className="mn-profile-phone-value text-[13px] text-muted-foreground">{ph.value}</span>
                      <Badge variant="outline" className="mn-profile-badge-type text-[9px] shrink-0 ml-2">Other</Badge>
                    </div>
                  ))}
                </div>
              </FeatureCard>

              {/* Person Activity (skeleton placeholder) */}
              <FeatureCard className="mn-profile-activity p-4">
                <h3 className="mn-profile-section-title flex items-center gap-2 text-[12px] font-semibold mb-3">
                  <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  Person Activity
                </h3>
                <div className="mn-profile-activity-skeleton space-y-3">
                  {[1,2,3].map((_, i) => (
                    <div key={i} className="mn-profile-activity-row flex items-center gap-3">
                      <div className="mn-profile-activity-bar h-2 w-16 bg-muted/50 rounded" />
                      <div className="mn-profile-activity-dot h-2 w-2 rounded-full bg-muted/30" />
                      <div className="mn-profile-activity-bar h-2 flex-1 bg-muted/30 rounded" />
                    </div>
                  ))}
                </div>
              </FeatureCard>

              {/* Ticket History */}
              {person.tickets.length > 0 && (
                <FeatureCard className="mn-profile-tickets p-4">
                  <h3 className="mn-profile-section-title flex items-center gap-2 text-[12px] font-semibold mb-3">
                    <Ticket className="h-3.5 w-3.5 text-muted-foreground" /> Ticket History
                  </h3>
                  <div className="mn-profile-ticket-list space-y-2.5">
                    {person.tickets.map((t, i) => (
                      <div key={i} className="mn-profile-ticket-row flex items-center justify-between">
                        <div className="mn-profile-ticket-info">
                          <p className="text-[12px] font-medium">{t.product}</p>
                          <p className="text-[10px] text-muted-foreground">{t.date} · {t.seatCategory}{t.isPremium ? ' ✦' : ''}</p>
                        </div>
                        <span className="text-[12px] font-semibold tabular-nums">${t.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="mn-profile-ticket-total flex items-center justify-between pt-2 border-t">
                      <span className="text-[11px] text-muted-foreground">Total Revenue</span>
                      <span className="text-[13px] font-bold tabular-nums">${person.tickets.reduce((s, t) => s + t.revenue, 0).toLocaleString()}</span>
                    </div>
                  </div>
                </FeatureCard>
              )}

              {/* Propensity Scores */}
              <FeatureCard className="mn-profile-scores p-4">
                <h3 className="mn-profile-section-title text-[12px] font-semibold mb-3">Propensity Scores</h3>
                <div className="mn-profile-score-list space-y-2.5">
                  {[
                    { label: "Ticket Purchase", score: person.scores.ticketBuy, color: "bg-blue-500" },
                    { label: "Renewal", score: person.scores.renewal, color: "bg-emerald-500" },
                    { label: "Premium Upgrade", score: person.scores.premium, color: "bg-amber-500" },
                    { label: "Churn Risk", score: person.scores.churn, color: "bg-red-500" },
                  ].map((s, i) => (
                    <div key={i} className="mn-profile-score-row">
                      <div className="mn-profile-score-header flex items-center justify-between mb-1">
                        <span className="mn-profile-score-label text-[11px] text-muted-foreground">{s.label}</span>
                        <span className="mn-profile-score-value text-[11px] font-semibold tabular-nums">{Math.round(s.score * 100)}</span>
                      </div>
                      <div className="mn-profile-score-track h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className={`mn-profile-score-fill h-full rounded-full transition-all ${s.color}`} style={{ width: `${s.score * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </FeatureCard>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
