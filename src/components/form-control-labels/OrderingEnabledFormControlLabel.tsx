import { usePatchAppConfigMeMutation } from "@/mutations/usePatchAppConfigMutation";
import { useGetAppConfigMeQuery } from "@/queries/useGetAppConfigMeQuery";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { AppConfigsApiGetAppConfigMeRequest } from "myorderapp-square";
import { useTranslations } from "next-intl";

export default function OrderingEnabledFormControlLabel() {
  const t = useTranslations("OrderingEnabledFormControlLabel");
  const params: AppConfigsApiGetAppConfigMeRequest = { actingAs: "merchant" };
  const { data: appConfig } = useGetAppConfigMeQuery(params);
  const { mutateAsync: patchAppConfigMe } = usePatchAppConfigMeMutation(params);
  return (
    <FormControlLabel
      control={
        <Switch
          checked={appConfig?.enabled ?? false}
          onChange={async (_event, checked) =>
            patchAppConfigMe({ appConfigUpdateBody: { enabled: checked } })
          }
        />
      }
      label={<Typography variant="h6">{t("label")}</Typography>}
    />
  );
}
