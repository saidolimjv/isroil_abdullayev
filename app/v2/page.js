import PageShell from "@/components/PageShell";
import site from "@/content/site";

export default function PageV2() {
  const v = site.heroVariants.v2;
  return <PageShell heroTitle={v.title} heroSubtitle={v.subtitle} />;
}
