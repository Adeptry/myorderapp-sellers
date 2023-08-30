import { SxProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { DynamicAccordion } from "./DynamicAccordion";

export default function CheckoutFaqAccordion(props: { sx?: SxProps }) {
  const t = useTranslations("CheckoutFaqAccordion");
  const keys = [
    "switching",
    "downgrading",
    "upgrading",
    "publishing",
    "cost",
    "billing",
    "ads",
    "support",
  ];
  const content = keys.map((key) => {
    return {
      summary: t(key + ".summary"),
      details: t(key + ".details"),
    };
  });
  return <DynamicAccordion content={content} sx={props.sx} />;
}
