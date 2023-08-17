import { List, SxProps } from "@mui/material";
import { Item, Variation } from "moa-merchants-ts-axios";
import { useState } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import ItemListItem from "./ItemListItem";

export default function ItemsList(props: {
  sx?: SxProps;
  entities: Item[];
  variations: Variation[];
  getVariations: (itemId: string) => void;
  onItemMove: (id: string, up: boolean) => void;
  onVariationUpdate: (id: string, moaEnabled: boolean) => void;
  onItemUpdate: (id: string, moaEnabled: boolean) => void;
}) {
  const {
    entities,
    onItemMove,
    onVariationUpdate,
    onItemUpdate,
    variations,
    getVariations,
  } = props;
  const [openItemIdState, setOpenItemIdState] = useState<
    string | undefined | null
  >(undefined);
  return (
    <List sx={props.sx}>
      <Flipper
        flipKey={entities.map((v) => v.id).join("")}
        portalKey="items"
        debug
      >
        {entities.map((value) => {
          return (
            <Flipped key={value.id} flipId={value.id ?? ""}>
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
                setIsIn={(open) => {
                  setOpenItemIdState(open ? value.id : undefined);
                }}
              />
            </Flipped>
          );
        })}
      </Flipper>
    </List>
  );
}
