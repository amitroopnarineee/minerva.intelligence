import { HomeContent } from "@/components/home/HomeContent"
import { HomeHeader } from "@/components/home/HomeHeader"

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col">
      <HomeHeader />
      <HomeContent />
    </div>
  )
}
