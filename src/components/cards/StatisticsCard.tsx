import { InfoOutlined } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

export function StatisticsCard(props: {
  title: string;
  sum: string;
  loading: boolean;
  average: string;
  maximum: string;
  minimum: string;
  tooltipTitle: string;
}) {
  const { title, sum, average, maximum, minimum, tooltipTitle, loading } =
    props;
  const t = useTranslations("StatisticsCard");

  return (
    <Card variant="outlined">
      <CardHeader
        action={
          <Tooltip title={tooltipTitle}>
            <InfoOutlined />
          </Tooltip>
        }
        sx={{ pb: 1 }}
        title={title}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="h3" sx={{ pb: 1 }}>
          {loading ? <Skeleton /> : sum}
        </Typography>

        <Typography
          color="text.secondary"
          variant="caption"
          sx={{ whiteSpace: "nowrap" }}
        >
          {loading ? (
            <Skeleton />
          ) : (
            <Fragment>
              <span style={{ whiteSpace: "nowrap" }}>
                {t("averageAbbreviation")}&nbsp;{average},
              </span>{" "}
              <span style={{ whiteSpace: "nowrap" }}>
                {t("maximumAbbreviation")}&nbsp;{maximum},
              </span>{" "}
              <span style={{ whiteSpace: "nowrap" }}>
                {t("minimumAbbreviation")}&nbsp;{minimum}
              </span>
            </Fragment>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}
