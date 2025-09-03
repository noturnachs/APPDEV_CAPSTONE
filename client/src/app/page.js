import Navbar from "@/components/shared/navbar"
import Hero from "@/app/landing/components/hero"
import About from "@/app/landing/components/about"
import Services from "@/app/landing/components/services"
import Clients from "@/app/landing/components/clients"
import Contact from "@/app/landing/components/contact"
import Footer from "@/components/shared/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar key="navbar" />
      <Hero key="hero" />
      <About key="about" />
      <Services key="services" />
      <Clients key="clients" />
      <Contact key="contact" />
      <Footer key="footer" />
    </main>
  )
}
