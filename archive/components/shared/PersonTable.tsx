"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { FeatureCard } from "@/components/shared/FeatureCard"
import type { Person } from "@/lib/data/persons"
import { useRouter } from "next/navigation"

interface PersonTableProps { persons: Person[] }

export function PersonTable({ persons }: PersonTableProps) {
  const router = useRouter()

  return (
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
                        return (
              <TableRow key={p.id} className="mn-ptable-row cursor-pointer hover:bg-accent/30 transition-colors"
                onClick={() => router.push(`/person-search/person/${p.id}`)}
                data-selectable data-select-type="Person" data-select-label={`${p.firstName} ${p.lastName}`}>
                <TableCell className="mn-ptable-cell-name">
                  <div className="mn-ptable-person flex items-center gap-3">
                    <UserAvatar name={`${p.firstName} ${p.lastName}`} size={32} />
                    <div className="mn-ptable-name-block min-w-0">
                      <div className="mn-ptable-name flex items-center gap-1.5">
                        <span className="mn-ptable-fullname text-[13px] font-medium">{p.firstName} {p.lastName}</span>

                      </div>
                      <p className="mn-ptable-location text-[11px] text-muted-foreground">{p.city}, {p.state}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="mn-ptable-cell-age text-[13px] tabular-nums">{p.age}</TableCell>
                <TableCell className="mn-ptable-cell-job">
                  <p className="mn-ptable-jobtitle text-[13px]">{p.jobTitle}</p>
                  <p className="mn-ptable-company text-[11px] text-muted-foreground">{p.company}</p>
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
  )
}
