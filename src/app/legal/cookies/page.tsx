import PageShell from '@/components/PageShell';

export const metadata = { title: "Cookies" };

export default function Page() {
  return (
    <PageShell
      path="/legal/cookies"
      title={"Cookies"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
