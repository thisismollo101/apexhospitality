import PageShell from '@/components/PageShell';

export const metadata = { title: "Dashboard Tour" };

export default function Page() {
  return (
    <PageShell
      path="/dashboard-tour"
      title={"Dashboard Tour"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
