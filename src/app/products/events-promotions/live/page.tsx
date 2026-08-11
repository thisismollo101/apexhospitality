import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex Live" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/events-promotions/live"
      title={"Apex Live"}
      product={catalogue["/products/events-promotions/live"]}
    />
  );
}
