import React from "react";
import { ArrowRight } from "lucide-react";

export default function Hero1() {
  return (
    <div className="relative w-full">
      <div className="absolute top-0 z-[0] h-full w-full"></div>
      <section className="relative z-1 mx-auto max-w-full">
        <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-50 [perspective:200px]">
          <div className="absolute inset-0 [transform:rotateX(35deg)]">
            <div className="animate-grid [inset:0%_0px] [margin-left:-50%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:120px_120px] [background-repeat:repeat]"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent to-90%"></div>
        </div>

        <div className="z-10 mx-auto max-w-screen-xl gap-12 px-4 py-28 text-gray-600 md:px-8">
          <div className="mx-auto max-w-3xl space-y-5 text-center leading-0 lg:leading-5">
            <h1 className="group mx-auto w-fit rounded-3xl border-[2px] border-white/5 bg-gradient-to-tr from-gray-500/5 via-slate-900/5 to-transparent mt-5 px-5 py-2 text-sm text-gray-400">
              Empowering student services
              <ArrowRight className="ml-2 inline h-4 w-4 duration-300 group-hover:translate-x-1" />
            </h1>

            <h2 className="font-geist mx-auto text-4xl bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-slate-950 md:text-6xl">
              Making academic support easier for{" "}
              <span className="bg-gradient-to-r from-purple-300 to-orange-200 bg-clip-text text-transparent">
                students and institutions.
              </span>
            </h2>

            <p className="mx-auto max-w-2xl text-slate-800">
              Litsamaiso helps students manage funding confirmations, upload
              bank info, and track their sponsorship status, all in one place.
            </p>
            <div className="items-center justify-center space-y-3 gap-x-3 sm:flex sm:space-y-0">
              <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 text-xs font-medium text-gray-50 backdrop-blur-3xl">
                  <a
                    href="/updates"
                    className="group border-input inline-flex w-full items-center justify-center rounded-full border-[1px] bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-10 py-4 text-center text-white transition-colors hover:bg-transparent/90 sm:w-auto"
                  >
                    Browse Updates
                  </a>
                </div>
              </span>
            </div>
          </div>
          <div className="mx-10 mt-32">
            <img
              src="/hero-img.png"
              className="w-full rounded-lg shadow-lg"
              alt="hero image"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
