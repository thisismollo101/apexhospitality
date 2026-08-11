import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Accommodation" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/billboards/accommodation"
      title={"Accommodation"}
      product={catalogue["/products/billboards/accommodation"]}
    />
  );
}
