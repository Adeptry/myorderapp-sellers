import { openGraphImages } from "@/app/shared-metadata";
import { SupportComponent } from "@/components/pages/SupportComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.support,
    openGraph: {
      ...dictionary.metadata.support.openGraph,
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return <SupportComponent />;
}
