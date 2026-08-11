import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex Atlas" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/guidebooks/atlas"
      title={"Apex Atlas"}
      product={catalogue["/products/guidebooks/atlas"]}
    />
  );
}
