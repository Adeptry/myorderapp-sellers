import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  SxProps,
  Typography,
} from "@mui/material";

export function DynamicAccordion(props: {
  sx?: SxProps;
  content: { summary: string; details: string }[];
}) {
  const content = props.content.map((item, index) => {
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`${item.summary}-content`}
          id={`${index}`}
        >
          <Typography sx={{ fontWeight: "bold" }}>{item.summary}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{item.details}</Typography>
        </AccordionDetails>
      </Accordion>
    );
  });

  return <Box sx={props.sx}>{content}</Box>;
}
