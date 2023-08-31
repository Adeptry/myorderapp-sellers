import { ItemListItem } from "@/components/catalogs/ItemListItem";
import { List, SxProps } from "@mui/material";
import { Item, Variation } from "moa-merchants-ts-axios";
import { useState } from "react";

export function ItemsList(props: {
  sx?: SxProps;
  entities: Item[];
  variations: Variation[];
  getVariations: (itemId: string) => void;
  onItemMove: (id: string, up: boolean) => void;
  onVariationUpdate: (id: string, moaEnabled: boolean) => void;
  onItemUpdate: (id: string, moaEnabled: boolean) => void;
  onObjectImageUpdate: (id: string, file: File) => Promise<void>;
}) {
  const {
    entities,
    onItemMove,
    onVariationUpdate,
    onItemUpdate,
    variations,
    getVariations,
    onObjectImageUpdate,
  } = props;
  const [openItemIdState, setOpenItemIdState] = useState<
    string | undefined | null
  >(undefined);
  return (
    <List sx={props.sx}>
      {entities.map((value) => {
        return (
          <ItemListItem
            isFirst={entities[0].id === value.id}
            isLast={entities[entities.length - 1].id === value.id}
            entity={value}
            variations={variations}
            getVariations={getVariations}
            isIn={openItemIdState === value.id}
            onItemMove={onItemMove}
            onVariationUpdate={onVariationUpdate}
            onItemUpdate={onItemUpdate}
            onObjectImageUpdate={onObjectImageUpdate}
            setIsIn={(open) => {
              setOpenItemIdState(open ? value.id : undefined);
            }}
          />
        );
      })}
    </List>
  );
}
