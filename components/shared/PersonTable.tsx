"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { PropensityRing, IdentityBar } from "@/components/shared/ScoreComponents"
import { PersonProfileSheet } from "@/components/shared/PersonProfileSheet"
import type { Person } from "@/lib/data/persons"
import { Mail, Phone } from "lucide-react"

interface PersonTableProps { persons: Person[]; showScores?: boolean }

const statusColors: Record<string, string> = { active_fan: "bg-emerald-500/10 text-emerald-500", season_ticket_holder: "bg-blue-500/10 text-blue-500", lapsed: "bg-red-500/10 text-red-500", prospect: "bg-amber-500/10 text-amber-500", anonymous: "bg-muted text-muted-foreground" }

export function PersonTable({ persons, showScores = true }: PersonTableProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  return (
    <>
      <FeatureCard className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Channels</TableHead>
              {showScores && <TableHead className="hidden lg:table-cell">Identity</TableHead>}
              {showScores && <TableHead className="text-right">Buy Score</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {persons.map((p) => {
              const initials = `${p.firstName[0]}${p.lastName[0]}`
              const hasEmail = p.contacts.some(c => c.type === "email")
              const hasPhone = p.contacts.some(c => c.type === "phone")
              return (
                <TableRow key={p.id} className="mn-person-row cursor-pointer" onClick={() => setSelectedPerson(p)}
                  data-selectable data-select-type="Person" data-select-label={`${p.firstName} ${p.lastName}`}
                  data-select-city={`${p.city}, ${p.state}`} data-select-status={p.fanStatus.replace(/_/g, " ")}
                  data-select-score={`${Math.round(p.scores.ticketBuy * 100)}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border"><AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">{initials}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium">{p.firstName} {p.lastName}</p><p className="text-[10px] text-muted-foreground">{p.ageBand} · {p.gender}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.city}, {p.state}</TableCell>
                  <TableCell><Badge className={`text-[10px] ${statusColors[p.fanStatus] ?? "bg-secondary text-secondary-foreground"}`}>{p.fanStatus.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell"><div className="flex items-center gap-1.5">{hasEmail && <Mail className="h-3 w-3 text-muted-foreground" />}{hasPhone && <Phone className="h-3 w-3 text-muted-foreground" />}</div></TableCell>
                  {showScores && <TableCell className="hidden lg:table-cell"><IdentityBar confidence={p.identityConfidence} completeness={p.profileCompleteness} /></TableCell>}
                  {showScores && <TableCell className="text-right"><PropensityRing score={p.scores.ticketBuy} size={32} /></TableCell>}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <span>Rows per page: 10</span>
          <span>1 - {persons.length} of {persons.length}</span>
        </div>
      </FeatureCard>
      <PersonProfileSheet person={selectedPerson} open={!!selectedPerson} onClose={() => setSelectedPerson(null)} />
    </>
  )
}
