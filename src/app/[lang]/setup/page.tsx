import { SetupComponent } from "@/components/pages/SetupComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";
import { openGraphImages } from "../../shared-metadata";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.index,
    openGraph: {
      ...dictionary.metadata.index.openGraph,
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return <SetupComponent />;
}