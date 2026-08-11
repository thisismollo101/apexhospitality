import PageShell from '@/components/PageShell';

export const metadata = { title: "On-site Visit" };

export default function Page() {
  return (
    <PageShell
      path="/deployment/on-site-visit"
      title={"On-site Visit"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
