import { openGraphImages } from "@/app/shared-metadata";
import { DashboardComponent } from "@/components/DashboardComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.dashboard,
    openGraph: {
      ...dictionary.metadata.dashboard.openGraph,
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return <DashboardComponent />;
}
