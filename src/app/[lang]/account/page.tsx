import { openGraphImages } from "@/app/shared-metadata";
import { AccountComponent } from "@/components/pages/AccountComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);

  return {
    ...dictionary.metadata.account,
    openGraph: {
      ...dictionary.metadata.account.openGraph,
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return <AccountComponent />;
}
