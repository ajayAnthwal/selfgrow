import { redirect } from 'next/navigation';

export default function OrdersRedirect({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect(`/${locale}/account/orders`);
}

