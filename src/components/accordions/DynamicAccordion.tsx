/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
