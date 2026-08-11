import PageShell from '@/components/PageShell';

export const metadata = { title: "Privacy" };

export default function Page() {
  return (
    <PageShell
      path="/legal/privacy"
      title={"Privacy"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
