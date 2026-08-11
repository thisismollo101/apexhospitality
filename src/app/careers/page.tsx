import PageShell from '@/components/PageShell';

export const metadata = { title: "Careers" };

export default function Page() {
  return (
    <PageShell
      path="/careers"
      title={"Careers"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
