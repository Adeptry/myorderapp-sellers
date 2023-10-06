import { PasswordForgotComponent } from "@/components/PasswordForgotComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return dictionary.metadata.resetPassword.index;
}

export default function Page() {
  return <PasswordForgotComponent />;
}
