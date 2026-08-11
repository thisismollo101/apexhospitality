import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex Anthem" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/signature-films/anthem"
      title={"Apex Anthem"}
      product={catalogue["/products/signature-films/anthem"]}
    />
  );
}
