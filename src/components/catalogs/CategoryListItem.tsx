import {
  ArrowDownward,
  ArrowUpward,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  ButtonGroup,
  IconButton,
  ListItem,
  ListItemText,
  Switch,
} from "@mui/material";
import { Category } from "moa-merchants-ts-axios";

export function CategoryListItem(props: {
  setIsIn: (open: boolean) => void;
  onCategoryMove: (id: string, up: boolean) => void;
  onCategoryUpdate: (id: string, moaEnabled: boolean) => void;
  isIn: boolean;
  entity: Category;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { setIsIn, isIn, entity, isFirst, isLast, onCategoryMove } = props;
  return (
    <ListItem>
      <IconButton
        onClick={async () => {
          setIsIn(!isIn);
        }}
      >
        {isIn ? <ExpandLess /> : <ExpandMore />}
      </IconButton>

      <ListItemText primary={entity.name} />
      <Switch
        checked={entity.moaEnabled ?? false}
        onChange={() => {
          if (entity.id) {
            props.onCategoryUpdate(entity.id, !entity.moaEnabled);
          }
        }}
      />
      <ButtonGroup variant="contained" sx={{ mr: 2 }}>
        <IconButton
          disabled={isFirst}
          onClick={() => {
            if (entity.id) {
              onCategoryMove(entity.id, true);
            }
          }}
        >
          <ArrowUpward />
        </IconButton>
        <IconButton
          disabled={isLast}
          onClick={() => {
            if (entity.id) {
              onCategoryMove(entity.id, false);
            }
          }}
        >
          <ArrowDownward />
        </IconButton>
      </ButtonGroup>
    </ListItem>
  );
}
