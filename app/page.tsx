import { Builds } from "@/components/builds";
import { Changelog } from "@/components/changelog";
import { Contributing } from "@/components/contributing";
import { Dependencies } from "@/components/dependencies";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";

export default function Page() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Changelog />
        <Builds />
        <Dependencies />
        <Contributing />
      </main>
      <Footer />
    </>
  );
}
