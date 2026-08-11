import PageShell from '@/components/PageShell';

export const metadata = { title: "Onboarding" };

export default function Page() {
  return (
    <PageShell
      path="/deployment/onboarding"
      title={"Onboarding"}
      lede="This page is scaffolded from navigation.json. Content lands with its template."
    />
  );
}
