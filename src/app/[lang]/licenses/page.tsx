import { LicensesPage } from "@/components/pages/LicensesPage";
import { Locale } from "@/types/next";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: { lang: Locale };
}): Promise<Metadata> {
  return {};
}

export default function Page() {
  return <LicensesPage />;
}
