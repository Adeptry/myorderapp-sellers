import { openGraphImages } from "@/app/shared-metadata";
import { LocationsComponent } from "@/components/pages/LocationsComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.locations,
    openGraph: {
      ...dictionary.metadata.locations.openGraph,
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return <LocationsComponent />;
}
