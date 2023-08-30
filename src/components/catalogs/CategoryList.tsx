import { CategoryListItem } from "@/components/catalogs/CategoryListItem";
import { ItemsList } from "@/components/catalogs/ItemsList";
import { Collapse, List, Paper } from "@mui/material";
import { Category, Item, Variation } from "moa-merchants-ts-axios";

export function CategoryList(props: {
  entity: Category;
  isIn: boolean;
  isFirst: boolean;
  isLast: boolean;
  setIsIn: (open: boolean) => void;
  onCategoryMove: (id: string, up: boolean) => void;
  items: Item[];
  getItems: (categoryId: string) => void;
  onItemMove: (id: string, up: boolean) => void;
  variations: Variation[];
  getVariations: (itemId: string) => void;
  onVariationUpdate: (id: string, moaEnabled: boolean) => void;
  onItemUpdate: (id: string, moaEnabled: boolean) => void;
  onCategoryUpdate: (id: string, moaEnabled: boolean) => void;
  onObjectImageUpdate: (id: string, file: File) => Promise<void>;
}) {
  const {
    entity,
    isIn,
    isFirst,
    isLast,
    setIsIn,
    onCategoryMove,
    items,
    getItems,
    onItemMove,
    variations,
    getVariations,
    onVariationUpdate,
    onItemUpdate,
    onCategoryUpdate,
    onObjectImageUpdate,
  } = props;

  return (
    <List>
      <CategoryListItem
        entity={entity}
        isFirst={isFirst}
        isLast={isLast}
        isIn={isIn}
        onCategoryUpdate={onCategoryUpdate}
        onCategoryMove={onCategoryMove}
        setIsIn={async (open) => {
          setIsIn(open);
          if (open && entity.id) {
            getItems(entity.id);
          }
        }}
      />
      <Collapse in={isIn} timeout="auto" unmountOnExit>
        <Paper elevation={4} sx={{ mx: 2, my: 1 }}>
          <ItemsList
            entities={items}
            onItemMove={onItemMove}
            onVariationUpdate={onVariationUpdate}
            onItemUpdate={onItemUpdate}
            variations={variations}
            getVariations={getVariations}
            onObjectImageUpdate={onObjectImageUpdate}
          />
        </Paper>
      </Collapse>
    </List>
  );
}
