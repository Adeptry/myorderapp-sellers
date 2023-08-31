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
      <Accordion key={`${index}-accordio`}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`${item.summary}-content`}
          key={`${index}-summary`}
        >
          <Typography variant="h6">{item.summary}</Typography>
        </AccordionSummary>
        <AccordionDetails key={`${index}-summary`}>
          <Typography variant="body1">{item.details}</Typography>
        </AccordionDetails>
      </Accordion>
    );
  });

  return <Box sx={props.sx}>{content}</Box>;
}
