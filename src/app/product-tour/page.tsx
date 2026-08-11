import PageShell from '@/components/PageShell';

export const metadata = { title: "Product Tour" };

export default function Page() {
  return (
    <PageShell
      path="/product-tour"
      title={"Product Tour"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
