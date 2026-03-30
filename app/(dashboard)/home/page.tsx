import { PageHeader } from "@/components/shared/PageHeader"
import { HomeContent } from "@/components/home/HomeContent"

export default function HomePage() {
  return (
    <>
      <PageHeader breadcrumb="Home" title="Home" subtitle="Welcome to Minerva." />
      <HomeContent />
    </>
  )
}
