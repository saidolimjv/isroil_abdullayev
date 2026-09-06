import PageShell from "@/components/PageShell";
import site from "@/content/site";

export default function PageV3() {
  const v = site.heroVariants.v3;
  return <PageShell heroTitle={v.title} heroSubtitle={v.subtitle} />;
}
