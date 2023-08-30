import { VariationsList } from "@/components/catalogs/VariationsList";
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Avatar,
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
import Image from "mui-image";
import { useState } from "react";

export function ItemListItem(props: {
  entity: Item;
  isIn: boolean;
  variations: Variation[];
  getVariations: (itemId: string) => void;
  onItemMove: (id: string, up: boolean) => void;
  setIsIn: (isIn: boolean) => void;
  onVariationUpdate: (id: string, moaEnabled: boolean) => void;
  onItemUpdate: (id: string, moaEnabled: boolean) => void;
  onObjectImageUpdate: (id: string, file: File) => Promise<void>;
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
    onObjectImageUpdate,
    isFirst,
    isLast,
  } = props;

  // Local state to manage the preview image URL
  const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Generate a local URL for the image preview
      setPreviewImgUrl(URL.createObjectURL(file));
      if (entity.id) {
        await onObjectImageUpdate(entity.id, file);
      }
    }
  };

  const imgUrl = previewImgUrl ?? entity.images?.at(0)?.url;

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
        <IconButton>
          <input
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
            id={`fileInput-${entity.id}`}
          />
          <label htmlFor={`fileInput-${entity.id}`}>
            <Avatar>{imgUrl ? <Image src={imgUrl} /> : <Add />}</Avatar>
          </label>
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
        <Paper elevation={6} sx={{ ml: 2, mr: 2, my: 1 }}>
          <VariationsList
            entities={variations}
            onVariationUpdate={onVariationUpdate}
          />
        </Paper>
      </Collapse>
    </Box>
  );
}
