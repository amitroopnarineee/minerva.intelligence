"use client"

import { use } from "react"
import { persons } from "@/lib/data/persons"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Mail, Phone, MapPin, Building2, Calendar, User2, Briefcase, ChevronRight } from "lucide-react"
import Link from "next/link"

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

export default function PersonDetailPage({ params }: { params: Promise<{ personId: string }> }) {
  const { personId } = use(params)
  const person = persons.find(p => p.id === personId)

  if (!person) {
    return <div className="flex-1 flex items-center justify-center text-muted-foreground">Person not found</div>
  }

  const initials = `${person.firstName[0]}${person.lastName[0]}`
  const primaryEmail = person.contacts.find(c => c.type === "email" && c.isPrimary)
  const otherEmails = person.contacts.filter(c => c.type === "email" && !c.isPrimary)
  const primaryPhone = person.contacts.find(c => c.type === "phone" && c.isPrimary)
  const otherPhones = person.contacts.filter(c => c.type === "phone" && !c.isPrimary)

  return (
    <div className="mn-person-page flex-1 overflow-y-auto p-6">
      <div className="mn-person-container mx-auto max-w-5xl">
        <PageTransition>
          {/* Breadcrumb */}
          <FadeIn className="mn-person-breadcrumb mb-4">
            <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Link href="/person-search" className="hover:text-foreground transition-colors">Person Search</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/person-search/dolphins" className="hover:text-foreground transition-colors">Miami Dolphins Fan Base</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground/80 font-medium">{person.firstName} {person.lastName}</span>
            </nav>
          </FadeIn>

          {/* Header */}
          <FadeIn className="mn-person-header mb-6 flex items-center gap-4">
            <Avatar className="mn-person-avatar h-16 w-16 border">
              <AvatarFallback className="mn-person-avatar-text bg-primary/10 text-xl font-bold text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="mn-person-header-info">
              <div className="mn-person-name-row flex items-center gap-2">
                <h1 className="mn-person-name text-[24px] font-semibold tracking-tight">{person.firstName} {person.lastName}</h1>
                <svg className="h-5 w-5 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
              <p className="mn-person-subtitle text-[14px] text-muted-foreground">{person.jobTitle} · {person.city}, {person.state}</p>
            </div>
          </FadeIn>

          {/* Two-column layout */}
          <div className="mn-person-body grid grid-cols-[1fr_320px] gap-5">
            {/* Left */}
            <div className="mn-person-left space-y-5">
              {/* Personal Information */}
              <FadeIn>
                <FeatureCard className="mn-person-personal p-5">
                  <h3 className="mn-person-section-title flex items-center gap-2 text-[13px] font-semibold mb-4">
                    <User2 className="h-4 w-4 text-muted-foreground" /> Personal Information
                  </h3>
                  <div className="mn-person-info-grid grid grid-cols-4 gap-x-6 gap-y-4">
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
              </FadeIn>

              {/* Experience */}
              <FadeIn>
                <FeatureCard className="mn-person-experience p-5">
                  <h3 className="mn-person-section-title flex items-center gap-2 text-[13px] font-semibold mb-4">
                    <Briefcase className="h-4 w-4 text-muted-foreground" /> Experience
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold">{person.jobTitle}</p>
                      <p className="text-[13px] text-muted-foreground">{person.company}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge variant="outline" className="text-[10px] bg-primary/5 border-primary/20 text-primary">Current</Badge>
                        <Badge variant="outline" className="text-[10px]">Full-Time</Badge>
                        <Badge variant="outline" className="text-[10px]">{person.household.incomeBand}</Badge>
                      </div>
                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-2"><Calendar className="h-3 w-3" /> Jan 2020 – Present</p>
                    </div>
                  </div>
                </FeatureCard>
              </FadeIn>

              {/* Address History */}
              <FadeIn>
                <FeatureCard className="mn-person-addresses p-5">
                  <h3 className="mn-person-section-title flex items-center gap-2 text-[13px] font-semibold mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" /> Address History
                  </h3>
                  <div className="space-y-4">
                    {mockAddresses.map((addr, i) => (
                      <div key={i}>
                        <p className="text-[13px] font-medium">{addr.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {addr.status && <Badge variant="outline" className="text-[10px] bg-primary/5 border-primary/20 text-primary">{addr.status}</Badge>}
                          {addr.type && <Badge variant="outline" className="text-[10px]">{addr.type}</Badge>}
                          {addr.value && <span className="text-[11px] text-muted-foreground">{addr.value}</span>}
                        </div>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1"><Calendar className="h-3 w-3" /> {addr.date}</p>
                        {i < mockAddresses.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </FeatureCard>
              </FadeIn>
            </div>

            {/* Right */}
            <div className="mn-person-right space-y-5">
              {/* Emails */}
              <FadeIn>
                <FeatureCard className="mn-person-emails p-4">
                  <h3 className="flex items-center gap-2 text-[12px] font-semibold mb-3"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Addresses</h3>
                  <div className="space-y-3">
                    {primaryEmail && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] truncate">{primaryEmail.value}</span>
                        <div className="flex gap-1 shrink-0">
                          <Badge className="text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/20">✦ Primary</Badge>
                          <Badge variant="outline" className="text-[9px]">Personal</Badge>
                        </div>
                      </div>
                    )}
                    {otherEmails.map((e, i) => (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <span className="text-[13px] text-muted-foreground truncate">{e.value}</span>
                        <Badge variant="outline" className="text-[9px] shrink-0">Work</Badge>
                      </div>
                    ))}
                  </div>
                </FeatureCard>
              </FadeIn>

              {/* Phones */}
              <FadeIn>
                <FeatureCard className="mn-person-phones p-4">
                  <h3 className="flex items-center gap-2 text-[12px] font-semibold mb-3"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone Numbers</h3>
                  <div className="space-y-3">
                    {primaryPhone && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px]">{primaryPhone.value}</span>
                        <div className="flex gap-1 shrink-0">
                          <Badge className="text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/20">✦ Primary</Badge>
                          <Badge variant="outline" className="text-[9px]">Mobile</Badge>
                        </div>
                      </div>
                    )}
                    {otherPhones.map((ph, i) => (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <span className="text-[13px] text-muted-foreground">{ph.value}</span>
                        <Badge variant="outline" className="text-[9px] shrink-0">Other</Badge>
                      </div>
                    ))}
                  </div>
                </FeatureCard>
              </FadeIn>

              {/* Activity skeleton */}
              <FadeIn>
                <FeatureCard className="mn-person-activity p-4">
                  <h3 className="flex items-center gap-2 text-[12px] font-semibold mb-3">
                    <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    Person Activity
                  </h3>
                  <div className="space-y-3">
                    {[1,2,3].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-2 w-16 bg-muted/50 rounded" />
                        <div className="h-2 w-2 rounded-full bg-muted/30" />
                        <div className="h-2 flex-1 bg-muted/30 rounded" />
                      </div>
                    ))}
                  </div>
                </FeatureCard>
              </FadeIn>

              {/* Propensity */}
              <FadeIn>
                <FeatureCard className="mn-person-scores p-4">
                  <h3 className="text-[12px] font-semibold mb-3">Propensity Scores</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: "Ticket Purchase", score: person.scores.ticketBuy, color: "bg-blue-500" },
                      { label: "Renewal", score: person.scores.renewal, color: "bg-emerald-500" },
                      { label: "Premium Upgrade", score: person.scores.premium, color: "bg-amber-500" },
                      { label: "Churn Risk", score: person.scores.churn, color: "bg-red-500" },
                    ].map((s, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-muted-foreground">{s.label}</span>
                          <span className="text-[11px] font-semibold tabular-nums">{Math.round(s.score * 100)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </FeatureCard>
              </FadeIn>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  )
}
