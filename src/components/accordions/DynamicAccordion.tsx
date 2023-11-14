import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  SxProps,
  Typography,
} from "@mui/material";
import { JSXElementConstructor, ReactElement, ReactNodeArray } from "react";

export function DynamicAccordion(props: {
  sx?: SxProps;
  content: {
    summary: string;
    details:
      | string
      | ReactElement<any, string | JSXElementConstructor<any>>
      | ReactNodeArray;
  }[];
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
        <AccordionDetails key={`${index}-details`}>
          <div dangerouslySetInnerHTML={{ __html: item.details }} />
        </AccordionDetails>
      </Accordion>
    );
  });

  return <Box sx={props.sx}>{content}</Box>;
}
