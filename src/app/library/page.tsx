import PageShell from '@/components/PageShell';

export const metadata = { title: "Library" };

export default function Page() {
  return (
    <PageShell
      path="/library"
      title={"Library"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
