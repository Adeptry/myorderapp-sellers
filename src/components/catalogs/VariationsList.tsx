import { List, SxProps } from "@mui/material";
import { Variation } from "moa-merchants-ts-axios";
import VariationListItem from "./VariationListItem";

export default function VariationsList(props: {
  sx?: SxProps;
  entities: Variation[];
  onVariationUpdate: (id: string, moaEnabled: boolean) => void;
}) {
  const { entities, onVariationUpdate } = props;
  return (
    <List sx={props.sx}>
      {entities.map((value) => {
        return (
          <VariationListItem
            entity={value}
            key={value.id}
            onVariationUpdate={onVariationUpdate}
          />
        );
      })}
    </List>
  );
}
