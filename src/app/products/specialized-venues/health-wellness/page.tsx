import ProductDetail, { catalogue } from '@/components/ProductDetail';

export const metadata = { title: "Health & Wellness" };

export default function Page() {
  return (
    <ProductDetail
      path="/products/specialized-venues/health-wellness"
      title={"Health & Wellness"}
      product={catalogue["/products/specialized-venues/health-wellness"]}
    />
  );
}
