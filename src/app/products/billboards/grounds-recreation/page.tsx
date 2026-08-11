import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Grounds & Recreation" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/billboards/grounds-recreation"
      title={"Grounds & Recreation"}
      product={catalogue["/products/billboards/grounds-recreation"]}
    />
  );
}
