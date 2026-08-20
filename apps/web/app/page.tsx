import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  ClipboardCheck,
  Layers3,
  Menu,
  MoveUpRight,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "~/components/ui/button";

const capabilities = [
  {
    eyebrow: "BUILD",
    title: "Make every question feel intentional.",
    body: "Start with the fields you need, shape the order, and give every form a clear point of view.",
    icon: Layers3,
    className: "bg-[#202522] text-[#f4f1ea]",
    accent: "bg-[#df7850]",
  },
  {
    eyebrow: "COLLECT",
    title: "Give answers room to happen.",
    body: "Share a simple link and collect thoughtful responses in a focused experience that stays out of the way.",
    icon: ClipboardCheck,
    className: "bg-[#1d2927] text-[#f4f1ea]",
    accent: "bg-[#668f7b]",
  },
  {
    eyebrow: "UNDERSTAND",
    title: "Turn response noise into a signal.",
    body: "See submissions together, track activity over time, and keep the next decision close to the data.",
    icon: BarChart3,
    className: "bg-[#25222b] text-[#f4f1ea]",
    accent: "bg-[#8871a8]",
  },
];

const fieldTypes = ["Short answer", "Email", "Yes / No"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#101112] pt-20 text-[#f4f1ea]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#2e302d]/80 bg-[#101112]/90 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold tracking-[-0.04em]"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-[#f4f1ea] text-[#101112]">
              <Layers3 className="size-4" />
            </span>
            FormType
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#aaa59b] lg:flex">
            <a href="#product" className="flex items-center gap-1 hover:text-[#f4f1ea]">
              Product <ChevronDown className="size-3.5" />
            </a>
            <a href="#use-cases" className="flex items-center gap-1 hover:text-[#f4f1ea]">
              Use cases <ChevronDown className="size-3.5" />
            </a>
            <a href="#principles" className="hover:text-[#f4f1ea]">
              Resources
            </a>
            <Link href="/login" className="hover:text-[#f4f1ea]">
              Log in
            </Link>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#f4f1ea] px-5 text-[#101112] hover:bg-white"
            >
              <Link href="/signup">
                Sign up free <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
            <Menu />
          </Button>
        </nav>
      </header>

      <section className="relative border-b border-[#2e302d] bg-[#181a19]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-28">
          <div className="max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#41433f] bg-[#202220] px-3 py-1.5 text-xs font-medium text-[#c5c0b5]">
              <Sparkles className="size-3.5 text-[#e8914a]" /> Forms for the questions that matter
            </div>
            <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-[#f4f1ea] sm:text-7xl lg:text-[5.6rem]">
              Create forms people <span className="text-[#e8914a]">want to finish.</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-[#aaa59b]">
              Build clear, beautiful forms in minutes. Collect the right answers, then see the
              signal in every response.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[#e8914a] px-7 text-[#101112] hover:bg-[#f0a566]"
              >
                <Link href="/signup">
                  Start building free <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-[#454640] bg-transparent px-7 text-[#f4f1ea] hover:bg-[#252724] hover:text-white"
              >
                <Link href="#product">See how it works</Link>
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-[#817f76]">
              <Check className="size-3.5 text-[#e8914a]" /> No credit card required
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:pl-6">
            <div className="absolute -right-2 top-8 size-20 rounded-full bg-[#e59b61] opacity-70 blur-2xl" />
            <div className="relative rotate-1 rounded-[2rem] border border-[#41433f] bg-[#101112] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
              <div className="rounded-[1.5rem] bg-[#202220] p-5 text-[#f4f1ea] sm:p-7">
                <div className="flex items-center justify-between text-xs text-[#aaa59b]">
                  <span>FormType / project-intake</span>
                  <span className="rounded-full bg-[#34483d] px-2.5 py-1 text-[#b6d5bd]">Live</span>
                </div>
                <div className="mt-14 max-w-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e59b61]">
                    Let&apos;s start here
                  </p>
                  <h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl">
                    Tell us what you&apos;re working on.
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-[#aaa59b]">
                    A short form for a better first conversation.
                  </p>
                </div>
                <div className="mt-12 space-y-3">
                  {fieldTypes.map((field, index) => (
                    <div
                      key={field}
                      className="flex items-center justify-between rounded-xl border border-[#454640] bg-[#292a27] px-4 py-4"
                    >
                      <span className="text-sm">
                        {field}
                        {index < 2 && <span className="ml-1 text-[#e59b61]">*</span>}
                      </span>
                      <span className="text-xs text-[#817f76]">0{index + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex items-center justify-between">
                  <span className="text-xs text-[#817f76]">3 questions</span>
                  <span className="rounded-lg bg-[#e59b61] px-4 py-2.5 text-xs font-semibold text-[#20201e]">
                    Continue <ArrowRight className="ml-1 inline size-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8914a]">
              One thoughtful workspace
            </p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-[-0.05em] text-[#f4f1ea] sm:text-5xl">
              Everything you need to ask, collect, and learn.
            </h2>
          </div>
          <p className="max-w-xl self-end text-lg leading-8 text-[#aaa59b]">
            FormType keeps the experience simple for the person filling out the form and the person
            making sense of what comes back.
          </p>
        </div>
        <div id="use-cases" className="mt-16 grid gap-4 lg:grid-cols-3">
          {capabilities.map(({ eyebrow, title, body, icon: Icon, className, accent }) => (
            <article key={eyebrow} className={`min-h-[330px] rounded-[1.5rem] p-7 ${className}`}>
              <div
                className={`flex size-11 items-center justify-center rounded-xl ${accent} text-white`}
              >
                <Icon className="size-5" />
              </div>
              <p className="mt-16 text-xs font-semibold tracking-[0.18em] opacity-60">{eyebrow}</p>
              <h3 className="mt-3 max-w-xs text-2xl font-semibold leading-tight tracking-[-0.04em]">
                {title}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-6 opacity-70">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="principles" className="border-y border-[#2e302d] bg-[#202220] text-[#f4f1ea]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8914a]">
                Made for momentum
              </p>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">
                Less wrestling with tools. More time with the answers.
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-fit rounded-full border-[#55554e] bg-transparent text-[#f4f1ea] hover:bg-[#30322f] hover:text-white"
            >
              <Link href="/signup">
                Try FormType <MoveUpRight />
              </Link>
            </Button>
          </div>
          <div className="mt-16 grid gap-10 border-t border-[#454640] pt-8 sm:grid-cols-3">
            <div>
              <p className="text-4xl font-semibold tracking-[-0.05em]">01</p>
              <p className="mt-3 text-sm leading-6 text-[#aaa59b]">
                Start from a blank canvas and make the form yours.
              </p>
            </div>
            <div>
              <p className="text-4xl font-semibold tracking-[-0.05em]">02</p>
              <p className="mt-3 text-sm leading-6 text-[#aaa59b]">
                Share one link wherever your audience already is.
              </p>
            </div>
            <div>
              <p className="text-4xl font-semibold tracking-[-0.05em]">03</p>
              <p className="mt-3 text-sm leading-6 text-[#aaa59b]">
                Watch responses become useful, organized insight.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10 lg:py-28">
        <Zap className="mx-auto size-7 text-[#e8914a]" />
        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.055em] text-[#f4f1ea] sm:text-6xl">
          Your next good question is waiting.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-[#aaa59b]">
          Turn the blank page into a form your audience will be glad to answer.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-9 h-12 rounded-full bg-[#f4f1ea] px-7 text-[#101112] hover:bg-white"
        >
          <Link href="/signup">
            Create a form for free <ArrowUpRight />
          </Link>
        </Button>
      </section>

      <footer className="border-t border-[#2e302d]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-[#817f76] sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <Link href="/" className="font-semibold text-[#f4f1ea]">
            FormType
          </Link>
          <span>Make the questions count. © 2026</span>
          <Link
            href="/login"
            className="flex items-center gap-1 text-[#f4f1ea] hover:text-[#e8914a]"
          >
            Log in <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
