import PageShell from '@/components/PageShell';

export const metadata = { title: "Compare plans" };

export default function Page() {
  return (
    <PageShell
      path="/plans"
      title={"Compare plans"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
