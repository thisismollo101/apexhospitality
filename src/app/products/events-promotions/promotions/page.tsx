import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex Promotions" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/events-promotions/promotions"
      title={"Apex Promotions"}
      product={catalogue["/products/events-promotions/promotions"]}
    />
  );
}
