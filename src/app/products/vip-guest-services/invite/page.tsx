import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex Invite" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/vip-guest-services/invite"
      title={"Apex Invite"}
      product={catalogue["/products/vip-guest-services/invite"]}
    />
  );
}
