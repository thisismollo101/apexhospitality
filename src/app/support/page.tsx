import PageShell from '@/components/PageShell';

export const metadata = { title: "Contact Support" };

export default function Page() {
  return (
    <PageShell
      path="/support"
      title={"Contact Support"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
