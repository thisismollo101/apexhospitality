import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Dining" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/billboards/dining"
      title={"Dining"}
      product={catalogue["/products/billboards/dining"]}
    />
  );
}
