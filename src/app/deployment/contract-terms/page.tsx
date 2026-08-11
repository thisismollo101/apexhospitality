import PageShell from '@/components/PageShell';

export const metadata = { title: "Contract Terms" };

export default function Page() {
  return (
    <PageShell
      path="/deployment/contract-terms"
      title={"Contract Terms"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
