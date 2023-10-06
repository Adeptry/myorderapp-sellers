import { openGraphImages } from "@/app/shared-metadata";
import { CustomersComponent } from "@/components/CustomersComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.customers,
    openGraph: {
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return <CustomersComponent />;
}
