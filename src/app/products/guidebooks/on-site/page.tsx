import PageShell from '@/components/PageShell';

export const metadata = { title: "On-site Guide" };

export default function Page() {
  return (
    <PageShell
      path="/products/guidebooks/on-site"
      title={"On-site Guide"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
