import { ListItem, ListItemText, Switch } from "@mui/material";
import { Variation } from "moa-merchants-ts-axios";

export function VariationListItem(props: {
  entity: Variation;
  onVariationUpdate: (id: string, moaEnabled: boolean) => void;
}) {
  const { entity, onVariationUpdate } = props;

  return (
    <ListItem key={entity.id}>
      <ListItemText primary={entity.name} />
      <Switch
        sx={{ mr: 8 }}
        checked={entity.moaEnabled ?? false}
        onChange={() => {
          if (entity.id) {
            onVariationUpdate(entity.id, !entity.moaEnabled);
          }
        }}
      />
    </ListItem>
  );
}
