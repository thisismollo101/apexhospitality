import PageShell from '@/components/PageShell';

export const metadata = { title: "Elite" };

export default function Page() {
  return (
    <PageShell
      path="/plans/elite"
      title={"Elite"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
