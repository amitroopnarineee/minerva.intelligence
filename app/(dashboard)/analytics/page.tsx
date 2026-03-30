import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition, FadeIn } from "@/components/shared/PageTransition"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader breadcrumb="Analytics" title="Executive Overview" subtitle="Get a comprehensive overview of your key business metrics."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Last 30 Days</Button>
            <Button variant="outline" size="sm">No Comparison</Button>
            <Button variant="outline" size="sm">Daily</Button>
          </div>
        }
      />
      <div className="mn-page flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <PageTransition>
            <FadeIn className="mb-6">
              <h1 className="mn-page-title text-[28px] font-semibold tracking-tight">Executive Overview</h1>
              <p className="mt-1 mn-page-subtitle text-sm text-muted-foreground">Get a comprehensive overview of your key business metrics.</p>
            </FadeIn>
            <FadeIn>
              <Tabs defaultValue={0}>
                <TabsList className="mb-6">
                  <TabsTrigger value={0}>Paid Ads</TabsTrigger>
                  <TabsTrigger value={1}>Meta Ads</TabsTrigger>
                  <TabsTrigger value={2}>Google Ads</TabsTrigger>
                </TabsList>
                <TabsContent value={0}>
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-24">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted"><span className="text-xl">📊</span></div>
                      <h3 className="text-base font-semibold">No Paid Ads data yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Connect your ad accounts to start tracking metrics.</p>
                      <Button className="mt-4">Connect Integration</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value={1}>
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-24">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted"><span className="text-xl">📱</span></div>
                      <h3 className="text-base font-semibold">No Meta Ads data yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Connect your Meta Ads account to start tracking metrics.</p>
                      <Button className="mt-4">Connect Integration</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value={2}>
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-24">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted"><span className="text-xl">🔍</span></div>
                      <h3 className="text-base font-semibold">No Google Ads data yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Connect your Google Ads account to start tracking metrics.</p>
                      <Button className="mt-4">Connect Integration</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </>
  )
}
