import { IndexComponent } from "@/components/IndexComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return dictionary.metadata.index;
}

export default function Page() {
  return <IndexComponent />;
}
