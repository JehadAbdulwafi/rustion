import { ModeSwitcher } from "@/components/header/mode-switcher"
import { MainNav } from "@/components/home/header/main-nav"
import { MobileNav } from "@/components/home/header/mobile-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SiteHeader({ user }: { user: User | undefined }) {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center mx-auto max-w-7xl">
          <MainNav />
          <MobileNav />
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {user === undefined ? (<Link
                href="/auth"
              >
                <Button variant={"secondary"}>
                  Login
                </Button>
              </Link>
              ) : (
                <Link
                  href="/dashboard"
                >
                  <Button variant={"secondary"}>
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
            <nav className="flex items-center gap-0.5">
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
