import { Collapse, List, Paper } from "@mui/material";
import { Category, Item, Variation } from "moa-merchants-ts-axios";
import CategoryListItem from "./CategoryListItem";
import ItemsList from "./ItemsList";

export default function CategoryList(props: {
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
          />
        </Paper>
      </Collapse>
    </List>
  );
}