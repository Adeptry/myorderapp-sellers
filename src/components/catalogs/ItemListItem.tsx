import {
  ArrowDownward,
  ArrowUpward,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Box,
  ButtonGroup,
  Collapse,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
  Switch,
} from "@mui/material";
import { Item, Variation } from "moa-merchants-ts-axios";
import VariationsList from "./VariationsList";

export default function ItemListItem(props: {
  entity: Item;
  isIn: boolean;
  variations: Variation[];
  getVariations: (itemId: string) => void;
  onItemMove: (id: string, up: boolean) => void;
  setIsIn: (isIn: boolean) => void;
  onVariationUpdate: (id: string, moaEnabled: boolean) => void;
  onItemUpdate: (id: string, moaEnabled: boolean) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const {
    entity,
    isIn,
    setIsIn,
    onItemMove,
    variations,
    getVariations,
    onVariationUpdate,
    onItemUpdate,
    isFirst,
    isLast,
  } = props;

  return (
    <Box>
      <ListItem key={entity.id}>
        <IconButton
          onClick={async () => {
            setIsIn(!isIn);
            if (!isIn && entity.id) {
              getVariations(entity.id);
            }
          }}
        >
          {isIn ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <ListItemText primary={entity.name} />
        <Switch
          checked={entity.moaEnabled ?? false}
          onChange={() => {
            if (entity.id) {
              onItemUpdate(entity.id, !entity.moaEnabled);
            }
          }}
        />
        <ButtonGroup variant="contained" sx={{}}>
          <IconButton
            disabled={isFirst}
            onClick={() => {
              if (entity.id) {
                onItemMove(entity.id, true);
              }
            }}
          >
            <ArrowUpward />
          </IconButton>
          <IconButton
            disabled={isLast}
            onClick={() => {
              if (entity.id) {
                onItemMove(entity.id, false);
              }
            }}
          >
            <ArrowDownward />
          </IconButton>
        </ButtonGroup>
      </ListItem>
      <Collapse in={isIn} timeout="auto" unmountOnExit>
        <Paper elevation={6} sx={{ ml: 2, my: 1 }}>
          <VariationsList
            entities={variations}
            onVariationUpdate={onVariationUpdate}
          />
        </Paper>
      </Collapse>
    </Box>
  );
}
