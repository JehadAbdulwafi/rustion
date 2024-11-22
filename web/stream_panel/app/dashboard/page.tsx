import Banner from "@/components/banner"
import { OverviewBar } from "@/components/charts/overview-bar"
import GettingStarted from "@/components/getting-started"
import RecentUpdates from "@/components/recent-updates"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Banner />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 col-span-1 sm:col-span-2">
          <GettingStarted />
          <div className="w-full col-span-1 sm:col-span-2 rounded-xl bg-muted/50">
            <OverviewBar />
          </div>
        </div>
        <div className="col-span-1 flex sm:col-span-2 lg:col-span-1">
          <RecentUpdates />
        </div>
      </div>
    </div>
  )
}
