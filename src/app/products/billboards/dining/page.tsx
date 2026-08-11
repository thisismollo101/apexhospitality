import PageShell from '@/components/PageShell';

export const metadata = { title: "Dining" };

export default function Page() {
  return (
    <PageShell
      path="/products/billboards/dining"
      title={"Dining"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
