import PageShell from '@/components/PageShell';

export const metadata = { title: "Premium" };

export default function Page() {
  return (
    <PageShell
      path="/plans/premium"
      title={"Premium"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
