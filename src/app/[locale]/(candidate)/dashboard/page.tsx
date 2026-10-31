import { redirect } from 'next/navigation';

export default function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Redirect to the candidate account dashboard
  redirect(`/${locale}/account`);
}
