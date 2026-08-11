import PageShell from '@/components/PageShell';

export const metadata = { title: "365 Daily" };

export default function Page() {
  return (
    <PageShell
      path="/app/daily"
      title={"365 Daily"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
