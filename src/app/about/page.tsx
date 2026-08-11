import PageShell from '@/components/PageShell';

export const metadata = { title: "About Us" };

export default function Page() {
  return (
    <PageShell
      path="/about"
      title={"About Us"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
