import PageShell from '@/components/PageShell';

export const metadata = { title: "Log in" };

export default function Page() {
  return (
    <PageShell
      path="/login"
      title={"Log in"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
