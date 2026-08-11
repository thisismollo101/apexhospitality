import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Corporate Events" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/specialized-venues/corporate-events"
      title={"Corporate Events"}
      product={catalogue["/products/specialized-venues/corporate-events"]}
    />
  );
}
