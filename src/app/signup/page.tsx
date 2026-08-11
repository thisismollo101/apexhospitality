import PageShell from '@/components/PageShell';

export const metadata = { title: "Sign up" };

export default function Page() {
  return (
    <PageShell
      path="/signup"
      title={"Sign up"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
