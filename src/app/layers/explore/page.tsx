import PageShell from '@/components/PageShell';

export const metadata = { title: "Explore" };

export default function Page() {
  return (
    <PageShell
      path="/layers/explore"
      title={"Explore"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
