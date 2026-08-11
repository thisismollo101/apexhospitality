import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Off-site Guide" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/guidebooks/off-site"
      title={"Off-site Guide"}
      product={catalogue["/products/guidebooks/off-site"]}
    />
  );
}
