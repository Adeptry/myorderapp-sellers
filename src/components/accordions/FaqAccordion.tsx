import { SxProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { DynamicAccordion } from "./DynamicAccordion";

export function FaqAccordion(props: { sx?: SxProps }) {
  const t = useTranslations("FaqAccordion");
  const keys = ["steps", "personalize", "pricing", "cancellation", "support"];
  const content = keys.map((key) => {
    return {
      summary: t(key + ".summary"),
      details: t.raw(key + ".details"),
    };
  });
  return <DynamicAccordion content={content} sx={props.sx} />;
}
