import { CheckoutStarterCompleteComponent } from "@/components/CheckoutStarterCompleteComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return dictionary.metadata.setup.starter.complete;
}

export default function Page() {
  return (
    <Suspense>
      <CheckoutStarterCompleteComponent />
    </Suspense>
  );
}
