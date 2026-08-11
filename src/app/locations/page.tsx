import PageShell from '@/components/PageShell';

export const metadata = { title: "Locations" };

export default function Page() {
  return (
    <PageShell
      path="/locations"
      title={"Locations"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
