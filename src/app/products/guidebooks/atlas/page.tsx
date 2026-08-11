import PageShell from '@/components/PageShell';

export const metadata = { title: "Apex Atlas" };

export default function Page() {
  return (
    <PageShell
      path="/products/guidebooks/atlas"
      title={"Apex Atlas"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
