import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Apex International" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/signature-films/international"
      title={"Apex International"}
      product={catalogue["/products/signature-films/international"]}
    />
  );
}
