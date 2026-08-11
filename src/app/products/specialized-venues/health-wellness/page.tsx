import PageShell from '@/components/PageShell';

export const metadata = { title: "Health & Wellness" };

export default function Page() {
  return (
    <PageShell
      path="/products/specialized-venues/health-wellness"
      title={"Health & Wellness"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
