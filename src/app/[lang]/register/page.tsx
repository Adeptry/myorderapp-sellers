import { openGraphImages } from "@/app/shared-metadata";
import { RegisterComponent } from "@/components/RegisterComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.register,
    openGraph: {
      ...dictionary.metadata.register.openGraph,
      ...openGraphImages,
    },
  };
}

export default async function Page() {
  return <RegisterComponent />;
}
