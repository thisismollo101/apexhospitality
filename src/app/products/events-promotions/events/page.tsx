import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex Events" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/events-promotions/events"
      title={"Apex Events"}
      product={catalogue["/products/events-promotions/events"]}
    />
  );
}
