import Image from "next/image";
import Link from "next/link";
import { MdLogin } from "react-icons/md";

export default function Hero() {
  return (
    <div className="bg-[#030303]">
      <div className="min-h-[80vh] flex flex-col bg-gradient-to-b from-[#7a29e8] via-[#4d1173] to-[#0e0718]">
        <header className="py-2 px-4 md:px-6 flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            <span className="text-2xl md:text-3xl text-white ml-2 md:ml-4 font-thin pl-2">
              YoutubeStats
            </span>
          </div>
          <nav className="hidden md:flex space-x-4 lg:space-x-8 mt-2 md:mt-0">
            <a href="#" className="text-gray-200 hover:text-white">
              Home
            </a>
            <a href="#" className="text-gray-200 hover:text-white">
              Case Study
            </a>
            <a href="#" className="text-gray-200 hover:text-white">
              Careers
            </a>
          </nav>
        </header>
        <main className="flex-grow flex items-center justify-center px-4 -mt-10 md:-mt-20">
        <div className="text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight mb-4">
            Horizontal <br /> Scaling on Youtube
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-xl md:max-w-2xl mx-auto mb-6">
            Millions of high-trust, low-cost views for mid-market and enterprise brands.
          </p>
          <Link
            href="/Login"
            className="inline-flex items-center justify-center bg-black text-white hover:bg-white hover:text-black rounded-md px-6 py-3 font-medium transition-colors duration-300"
            aria-label="Get Started and Login"
          >
            Get Started
            <MdLogin className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </main>
      </div>

      <div className="w-full flex justify-center -mt-10 md:-mt-20 px-4">
        <div className="w-full md:w-4/5 relative">
          <Image
            src="/stats.png"
            alt="stats dash image"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-evenly text-center text-white font-semibold py-8 px-4">
        <div className="mb-6 md:mb-0">
          <span className="text-4xl md:text-6xl lg:text-7xl">50m+</span>
          <p className="text-sm md:text-base lg:text-sm text-gray-400 mt-2">
            Monthly Impressions
          </p>
        </div>
        <div className="hidden md:block">
          <hr className="bg-gray-400 h-20 w-0.5 mx-5" />
        </div>
        <div className="mb-6 md:mb-0">
          <span className="text-4xl md:text-6xl lg:text-7xl">2,000+</span>
          <p className="text-sm md:text-base lg:text-sm text-gray-400 mt-2">
            Posts per day
          </p>
        </div>
        <div className="hidden md:block">
          <hr className="bg-gray-400 h-20 w-0.5 mx-5" />
        </div>
        <div>
          <span className="text-4xl md:text-6xl lg:text-7xl">1,000+</span>
          <p className="text-sm md:text-base lg:text-sm text-gray-400 mt-2">
            Accounts
          </p>
        </div>
      </div>
    </div>
  );
}
