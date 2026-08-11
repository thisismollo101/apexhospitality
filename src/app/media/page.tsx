import PageShell from '@/components/PageShell';

export const metadata = { title: "Media" };

export default function Page() {
  return (
    <PageShell
      path="/media"
      title={"Media"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
