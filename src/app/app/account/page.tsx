import PageShell from '@/components/PageShell';

export const metadata = { title: "Account" };

export default function Page() {
  return (
    <PageShell
      path="/app/account"
      title={"Account"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
