import PageShell from '@/components/PageShell';

export const metadata = { title: "Partners" };

export default function Page() {
  return (
    <PageShell
      path="/partners"
      title={"Partners"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
