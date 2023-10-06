import { openGraphImages } from "@/app/shared-metadata";
import { PasswordResetComponent } from "@/components/PasswordResetComponent";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getMessages(props.params.lang);
  return {
    ...dictionary.metadata.resetPassword.confirm,
    openGraph: {
      ...dictionary.metadata.resetPassword.confirm.openGraph,
      ...openGraphImages,
    },
  };
}

export default function Page() {
  return <PasswordResetComponent />;
}
