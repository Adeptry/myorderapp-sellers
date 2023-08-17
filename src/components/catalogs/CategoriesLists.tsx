import { Box, Paper, Skeleton } from "@mui/material";
import { Category, Item, Variation } from "moa-merchants-ts-axios";
import { useState } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import CategoryList from "./CategoryList";

export function CategoriesLists(props: {
  entities: Category[];
  getItems: (categoryId: string) => void;
  items: Item[];
  onCategoryMove: (id: string, up: boolean) => void;
  onItemMove: (id: string, up: boolean) => void;
  variations: Variation[];
  getVariations: (itemId: string) => void;
  onVariationUpdate: (id: string, moaEnabled: boolean) => void;
  onItemUpdate: (id: string, moaEnabled: boolean) => void;
  onCategoryUpdate: (id: string, moaEnabled: boolean) => void;
  preloading: boolean;
}) {
  const {
    entities,
    getItems,
    onCategoryMove,
    items,
    onItemMove,
    variations,
    getVariations,
    onVariationUpdate,
    onItemUpdate,
    onCategoryUpdate,
    preloading,
  } = props;

  const [openCategoryIdState, setOpenCategoryIdState] = useState<
    string | undefined | null
  >(undefined);

  return (
    <Box sx={{ width: "100%" }}>
      {preloading &&
        Array(8)
          .fill(null)
          .map((_, i) => <Skeleton key={i} height={"88px"} />)}
      {!preloading && (
        <Flipper
          flipKey={entities.map((v) => v.id).join("")}
          portalKey="categories"
        >
          {entities.map((entity) => {
            return (
              <Flipped key={entity.id} flipId={entity.id ?? ""}>
                <Paper elevation={2} sx={{ mb: 2 }}>
                  <CategoryList
                    onCategoryMove={onCategoryMove}
                    entity={entity}
                    isIn={openCategoryIdState === entity.id}
                    isFirst={entities[0].id === entity.id}
                    isLast={entities[entities.length - 1].id === entity.id}
                    setIsIn={(open) => {
                      setOpenCategoryIdState(open ? entity.id : undefined);
                    }}
                    getItems={getItems}
                    items={items}
                    onItemMove={onItemMove}
                    variations={variations}
                    getVariations={getVariations}
                    onVariationUpdate={onVariationUpdate}
                    onItemUpdate={onItemUpdate}
                    onCategoryUpdate={onCategoryUpdate}
                  />
                </Paper>
              </Flipped>
            );
          })}
        </Flipper>
      )}
    </Box>
  );
}
