import { openGraphImages } from "@/app/shared-metadata";
import { SetupTierComponent } from "@/components/pages/SetupTierComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.setup.plan,
    openGraph: {
      ...dictionary.metadata.setup.plan.openGraph,
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return <SetupTierComponent />;
}
