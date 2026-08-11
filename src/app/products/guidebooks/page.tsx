import PageShell from '@/components/PageShell';

export const metadata = { title: "Guidebooks" };

export default function Page() {
  return (
    <PageShell
      path="/products/guidebooks"
      title={"Guidebooks"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
