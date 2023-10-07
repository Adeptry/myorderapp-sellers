import { openGraphImages } from "@/app/shared-metadata";
import { CheckoutFreeCompleteComponent } from "@/components/pages/CheckoutFreeCompleteComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.setup.free.complete,
    openGraph: {
      ...dictionary.metadata.setup.free.complete.openGraph,
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return (
    <Suspense>
      <CheckoutFreeCompleteComponent />
    </Suspense>
  );
}
