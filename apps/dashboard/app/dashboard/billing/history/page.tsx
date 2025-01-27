import { getTransactions } from "@/api/subscriptionsApi";
import HistoryScene from "./components/history-scene";
import { catchErrorTyped } from "@/api/ApiError";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function page() {
  const [err, transactions] = await catchErrorTyped(getTransactions());

  if (err !== undefined) {
    return <div>{err.message}</div>
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">History</h1>
            <p className="text-sm text-muted-foreground">
              View all of your transactions here
            </p>
          </div>
        </div>
      </div>
      <HistoryScene transactions={transactions!} />
    </div>
  )
}

