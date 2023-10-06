import { openGraphImages } from "@/app/shared-metadata";
import { OrdersComponent } from "@/components/OrdersComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.orders,
    openGraph: {
      ...dictionary.metadata.orders.openGraph,
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return <OrdersComponent />;
}
