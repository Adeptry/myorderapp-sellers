import { SetupAppConfigComponent } from "@/components/SetupAppConfigComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return dictionary.metadata.setup.theme;
}

export default function Page() {
  return <SetupAppConfigComponent />;
}
