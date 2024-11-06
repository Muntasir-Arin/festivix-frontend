import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Ticket } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#1a1a2e]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-white text-2xl font-bold">
            El Camino
          </Link>
          <div className="hidden md:flex space-x-6 text-white">
            <Link href="/login" className="hover:text-pink-500 transition">LOGIN</Link>
            <Link href="/register" className="hover:text-pink-500 transition">SIGN-UP</Link>
          </div>
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="/trailer1.webp"
          alt="Captains of the World"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <div className="space-y-6">
            <p className="text-sm md:text-base uppercase tracking-wider">NOW PLAYING</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif">Captains of the World</h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/info"
                className="bg-white text-black px-8 py-3 rounded-full hover:bg-pink-500 hover:text-white transition"
              >
                GET INFORMATION
              </Link>
              <Link
                href="/tickets"
                className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition"
              >
                BUY TICKETS NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Shows", icon: Ticket, img : '/shows.jpg' },
            { title: "Tickets", icon: Ticket, img : '/tickets.jpg' },
            { title: "Calendar", icon: Calendar, img : '/info.jpg' },
            { title: "About", icon: Clock, img : '/about.jpg' },
          ].map((item, index) => (
            <Link
              key={index}
              href={`/${item.title.toLowerCase()}`}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover brightness-50 group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <item.icon className="w-8 h-8 mb-2" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm mt-1">LEARN MORE</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="/muchasos.jpg"
              alt="Evita Performance"
              width={1600}
              height={800}
              className="w-full object-cover brightness-50"
            />
            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
              <div className="text-white space-y-4">
                <p className="text-sm uppercase tracking-wider">COMING SOON</p>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif max-w-[800px]">Muchachos: La película de la gente</h2>
                <p className="text-lg max-w-[800px]">The celebrations for the title of the Argentine National Team in the World Cup in Qatar 2022, through videos of Argentines around the world and unpublished material of the party in the streets.</p>
              </div>
              <div className="mt-8 md:mt-0 text-white text-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-3xl font-bold">7:30</p>
                    <p className="text-sm">START TIME</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">2:15</p>
                    <p className="text-sm">DURATION</p>
                  </div>
                  <p className="text-sm">PLAYS NOV 1ST - 15TH</p>
                  <Link
                    href="/tickets/evita"
                    className="block bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition"
                  >
                    BUY TICKETS NOW
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Our Performances</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {[...Array(8)].map((_, i) => (
              <Image
                key={i}
                src={`/placeholder.svg?height=300&width=400`}
                alt={`Performance ${i + 1}`}
                width={400}
                height={300}
                className="rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact Us</h2>
          <form className="max-w-lg mx-auto space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="text-2xl font-bold">
                Theater
              </Link>
              <p className="mt-4 text-gray-400">
                Bringing stories to life on stage since 1985.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/shows" className="hover:text-pink-500 transition">Shows & Tickets</Link></li>
                <li><Link href="/calendar" className="hover:text-pink-500 transition">Calendar</Link></li>
                <li><Link href="/about" className="hover:text-pink-500 transition">About Us</Link></li>
                <li><Link href="/support" className="hover:text-pink-500 transition">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-pink-500 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="hover:text-pink-500 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.772-1.153c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                123 Theater Street, City, State • (555) 555-5555
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Theater. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}