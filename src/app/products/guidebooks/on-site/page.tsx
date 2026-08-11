import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "On-site Guide" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/guidebooks/on-site"
      title={"On-site Guide"}
      product={catalogue["/products/guidebooks/on-site"]}
    />
  );
}
