import PageShell from '@/components/PageShell';

export const metadata = { title: "Terms" };

export default function Page() {
  return (
    <PageShell
      path="/legal/terms"
      title={"Terms"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
