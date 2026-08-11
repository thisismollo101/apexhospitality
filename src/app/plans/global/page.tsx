import PageShell from '@/components/PageShell';

export const metadata = { title: "Global" };

export default function Page() {
  return (
    <PageShell
      path="/plans/global"
      title={"Global"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
