"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { PersonProfileSheet } from "@/components/shared/PersonProfileSheet"
import type { Person } from "@/lib/data/persons"

interface PersonTableProps { persons: Person[] }

export function PersonTable({ persons }: PersonTableProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  return (
    <>
      <FeatureCard className="mn-ptable-root overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="mn-ptable-header">
              <TableHead className="mn-ptable-th-name">Name</TableHead>
              <TableHead className="mn-ptable-th-age w-16">Age</TableHead>
              <TableHead className="mn-ptable-th-job">Job Title</TableHead>
              <TableHead className="mn-ptable-th-wealth">Wealth</TableHead>
              <TableHead className="mn-ptable-th-income">Income</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {persons.map((p) => {
              const initials = `${p.firstName[0]}${p.lastName[0]}`
              return (
                <TableRow key={p.id} className="mn-ptable-row cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => setSelectedPerson(p)}
                  data-selectable data-select-type="Person" data-select-label={`${p.firstName} ${p.lastName}`}>
                  <TableCell className="mn-ptable-cell-name">
                    <div className="mn-ptable-person flex items-center gap-3">
                      <Avatar className="mn-ptable-avatar h-8 w-8 border shrink-0">
                        <AvatarFallback className="mn-ptable-initials bg-primary/10 text-[10px] font-bold text-primary">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="mn-ptable-name-block min-w-0">
                        <div className="mn-ptable-name flex items-center gap-1.5">
                          <span className="mn-ptable-fullname text-[13px] font-medium">{p.firstName} {p.lastName}</span>
                          <svg className="mn-ptable-linkedin h-3.5 w-3.5 text-[#0A66C2] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </div>
                        <p className="mn-ptable-location text-[11px] text-muted-foreground">{p.city}, {p.state}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="mn-ptable-cell-age text-[13px] tabular-nums">{p.age}</TableCell>
                  <TableCell className="mn-ptable-cell-job">
                    <div className="mn-ptable-job-block">
                      <p className="mn-ptable-jobtitle text-[13px]">{p.jobTitle}</p>
                      <p className="mn-ptable-company text-[11px] text-muted-foreground">{p.company}</p>
                    </div>
                  </TableCell>
                  <TableCell className="mn-ptable-cell-wealth text-[13px] text-muted-foreground">{p.household.netWorthBand}</TableCell>
                  <TableCell className="mn-ptable-cell-income text-[13px] text-muted-foreground">{p.household.incomeBand}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="mn-ptable-footer flex items-center justify-between border-t px-4 py-3 text-[11px] text-muted-foreground">
          <span>Rows per page: 25</span>
          <span>1 – {persons.length} of {persons.length}</span>
        </div>
      </FeatureCard>
      <PersonProfileSheet person={selectedPerson} open={!!selectedPerson} onClose={() => setSelectedPerson(null)} />
    </>
  )
}
