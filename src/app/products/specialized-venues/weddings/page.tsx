import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Weddings" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/specialized-venues/weddings"
      title={"Weddings"}
      product={catalogue["/products/specialized-venues/weddings"]}
    />
  );
}
