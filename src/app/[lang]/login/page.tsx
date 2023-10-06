import { LoginComponent } from "@/components/LoginComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next/types";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const messages = await getMessages(props.params.lang);
  return messages.metadata.login;
}

export default function Page() {
  return <LoginComponent />;
}
