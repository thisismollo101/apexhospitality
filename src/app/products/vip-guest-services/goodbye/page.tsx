import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex Goodbye" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/vip-guest-services/goodbye"
      title={"Apex Goodbye"}
      product={catalogue["/products/vip-guest-services/goodbye"]}
    />
  );
}
