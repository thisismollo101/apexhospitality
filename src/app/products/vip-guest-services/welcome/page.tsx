import PageShell from '@/components/PageShell';

export const metadata = { title: "Apex Welcome" };

export default function Page() {
  return (
    <PageShell
      path="/products/vip-guest-services/welcome"
      title={"Apex Welcome"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
