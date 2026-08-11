import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex Flagship" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/signature-films/flagship"
      title={"Apex Flagship"}
      product={catalogue["/products/signature-films/flagship"]}
    />
  );
}
