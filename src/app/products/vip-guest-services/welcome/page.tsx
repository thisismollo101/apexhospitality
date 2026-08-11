import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex Welcome" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/vip-guest-services/welcome"
      title={"Apex Welcome"}
      product={catalogue["/products/vip-guest-services/welcome"]}
    />
  );
}
