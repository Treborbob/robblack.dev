import { Builds } from "@/components/builds";
import { Changelog } from "@/components/changelog";
import { Contributing } from "@/components/contributing";
import { Dependencies } from "@/components/dependencies";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Runtime } from "@/components/runtime";
import { buildInfo } from "@/lib/build-info";
import { person } from "@/lib/content";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  url: "https://robblack.dev",
  email: `mailto:${person.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ipswich",
    addressRegion: "Suffolk",
    addressCountry: "GB",
  },
  worksFor: { "@type": "Organization", name: person.currentOrg },
  sameAs: [person.github, person.linkedin],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from our own content
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
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
      <Runtime build={buildInfo()} />
    </>
  );
}
