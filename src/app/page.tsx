import type { Metadata } from "next";
import tenant from "@/fixtures/tenant.json";
import { resolveLocale, buildHreflang, buildCanonical } from "@/lib/resolve-locale";
import { buildChurchEntity, buildBreadcrumb } from "@/lib/json-ld";

const locales = ["lt", "en", "ru"] as const;

export function generateMetadata(): Metadata {
  const name = resolveLocale(tenant.name, "lt");
  return {
    title: `${name} — Protestant Church Landing | ${tenant.slug}`,
    alternates: {
      canonical: buildCanonical(tenant.identity.domain),
      languages: buildHreflang(tenant.identity.domain, locales),
    },
  };
}

export default function ProtestantPage() {
  const locale = "lt";
  const t = (obj: Record<string, string>) => resolveLocale(obj, locale);
  const churchEntity = buildChurchEntity({
    name: t(tenant.name),
    address: tenant.identity.address,
    phone: tenant.identity.phone,
    geo: { lat: 54.6872, lng: 25.2797 },
    parentOrganization: tenant.identity.jurisdiction || "",
    additionalProperty: [{ name: "denomination", value: "Lutheran" }]
  });
  const breadcrumb = buildBreadcrumb([
    { name: t(tenant.name), url: `https://${tenant.identity.domain}/` },
  ]);
  const page = tenant.pages[0];

  const hero = page.contentBlocks[0] as any;
  const schedule = page.contentBlocks[1] as any;
  const kv = page.contentBlocks[2] as any;
  const cta = page.contentBlocks[page.contentBlocks.length - 1] as any;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(churchEntity) } }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(breadcrumb) } }
      />

      {/* Hero */}
      <section aria-label="Hero" className="bg-green-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t(hero.heading)}</h1>
          <p className="text-lg text-gray-600">{t(hero.body)}</p>
        </div>
      </section>

      {/* Schedule */}
      <section aria-label="Service schedule" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">{t(schedule.heading)}</h2>
          <div className="space-y-3">
            {schedule.entries.map((entry: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{entry.dayEn || entry.day}</span>
                <div>
                  <span className="text-gray-600">{entry.times.join(", ")}</span>
                  {entry.notes && <span className="text-sm text-gray-500 ml-2">({entry.notes})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section aria-label="Contact" className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{t(kv.heading)}</h2>
          <dl className="space-y-2">
            {kv.items.map((item: any, i: number) => (
              <div key={i} className="flex gap-2">
                <dt className="font-medium text-gray-700 min-w-[120px]">{t(item.label)}:</dt>
                <dd className="text-gray-600">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Quick links" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex flex-wrap gap-4 justify-center">
            {cta.links.map((link: any, i: number) => (
              <a key={i} href={link.href} className="px-6 py-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors font-medium">{t(link.label)}</a>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
