import { useUpdateCategoriesMutation } from "@/mutations/useUpdateCategoriesMutation";
import { useUpdateItemsMutation } from "@/mutations/useUpdateItemsMutation";
import { useUpdateVariationMutation } from "@/mutations/useUpdateVariationMutation";
import { useUploadImageToSquareCatalogMutation } from "@/mutations/useUploadImageToSquareCatalogMutation";
import { useCurrentCatalogQuery } from "@/queries/useCurrentCatalogQuery";
import { StrictModeDroppable } from "@/utils/StrictModeDroppable";
import { logger } from "@/utils/logger";
import { Add, DragHandle, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Switch,
} from "@mui/material";
import { Image } from "mui-image";
import { nanoid } from "nanoid";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";

export function CatalogAccordion() {
  const currentCatalogQuery = useCurrentCatalogQuery();
  const currentCatalogCategories = currentCatalogQuery.data?.data ?? [];

  const updateItemsMutation = useUpdateItemsMutation();
  const updateCategoriesMutation = useUpdateCategoriesMutation();
  const updateVariationMutation = useUpdateVariationMutation();
  const uploadImageToSquareCatalogMutation =
    useUploadImageToSquareCatalogMutation();

  const handleCategoryDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const newCategories = Array.from(
      currentCatalogCategories.map((category) => ({ ...category }))
    );

    const [movedCategory] = newCategories.splice(source.index, 1);
    newCategories.splice(destination.index, 0, movedCategory);

    const minIndex = Math.min(source.index, destination.index);
    const maxIndex = Math.max(source.index, destination.index);

    for (let i = minIndex; i <= maxIndex; i++) {
      newCategories[i].moaOrdinal = i;
    }

    const updatedCategoriesDtos = newCategories
      .slice(minIndex, maxIndex + 1)
      .map((category) => ({
        id: category.id!,
        moaOrdinal: category.moaOrdinal,
        moaEnabled: category.moaEnabled,
      }));

    updateCategoriesMutation.mutateAsync(updatedCategoriesDtos);
  };

  const handleItemDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    const sourceCategoryId = source.droppableId;
    const destinationCategoryId = destination?.droppableId;
    const category = currentCatalogCategories.find(
      (value) => value.id === sourceCategoryId
    );
    if (
      !destination ||
      !category ||
      sourceCategoryId !== destinationCategoryId
    ) {
      logger.error("cancelled item drag end");
      return;
    }

    const newItems = Array.from(
      (category.items ?? []).map((item) => ({ ...item }))
    );
    const [movedItem] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, movedItem);
    const minIndex = Math.min(source.index, destination.index);
    const maxIndex = Math.max(source.index, destination.index);

    for (let i = minIndex; i <= maxIndex; i++) {
      newItems[i].moaOrdinal = i;
    }

    const updatedItemsDtos = newItems
      .slice(minIndex, maxIndex + 1)
      .map((item) => ({
        id: item.id!,
        moaOrdinal: item.moaOrdinal,
        moaEnabled: item.moaEnabled,
      }));

    updateItemsMutation.mutateAsync(updatedItemsDtos);
  };

  const handleDragEnd = (result: DropResult) => {
    if (result.type === "category") {
      handleCategoryDragEnd(result);
    } else if (result.type.indexOf("item") !== -1) {
      handleItemDragEnd(result);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return; // Handle error, perhaps show a user-friendly message
    }

    const file = files[0];
    const validTypes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"];

    if (!validTypes.includes(file.type)) {
      return; // Handle error
    }

    if (file.size > 15 * 1024 * 1024) {
      return; // Handle error
    }

    uploadImageToSquareCatalogMutation
      .mutateAsync({
        id: itemId,
        file,
        idempotencyKey: nanoid(),
      })
      .catch((error) => {
        // Handle error, log or display a message
      });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable droppableId="categories" type="category">
        {(provided) => (
          <Box
            sx={{ width: "100%" }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {currentCatalogCategories.map((currentCatalogCategory, index) => (
              <Draggable
                key={currentCatalogCategory.id!}
                draggableId={`${currentCatalogCategory.id!}-draggableId`}
                index={index}
              >
                {(provided) => (
                  <Paper
                    elevation={2}
                    sx={{ mb: 2 }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{ mr: 2 }}
                      >
                        <Box display="flex" alignItems="center">
                          <IconButton disabled size="small">
                            <DragHandle />
                          </IconButton>
                        </Box>
                        <ListItemText
                          sx={{ display: "flex", flexGrow: 1 }}
                          primary={currentCatalogCategory.name}
                        />

                        <Box
                          display="flex"
                          alignItems="center"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Switch
                            size="small"
                            checked={currentCatalogCategory.moaEnabled ?? false}
                            onChange={() => {
                              updateCategoriesMutation.mutateAsync([
                                {
                                  id: currentCatalogCategory.id!,
                                  moaEnabled:
                                    !currentCatalogCategory.moaEnabled,
                                },
                              ]);
                            }}
                          />
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails>
                        <StrictModeDroppable
                          droppableId={`${currentCatalogCategory.id!}`}
                          type={`item-${currentCatalogCategory.id!}`}
                        >
                          {(provided) => (
                            <List
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {currentCatalogCategory.items?.map(
                                (itemInCategory, childIndex) => (
                                  <Draggable
                                    key={itemInCategory.id!}
                                    draggableId={itemInCategory.id!}
                                    index={childIndex}
                                  >
                                    {(provided) => (
                                      <Accordion
                                        elevation={4}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <AccordionSummary
                                          key={itemInCategory.id}
                                          expandIcon={<ExpandMore />}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              width: "100%",
                                            }}
                                          >
                                            <IconButton disabled size="small">
                                              <DragHandle />
                                            </IconButton>

                                            <ListItemText
                                              primary={itemInCategory.name}
                                            />
                                            <IconButton
                                              size="small"
                                              sx={{ mr: 1 }}
                                            >
                                              <input
                                                type="file"
                                                style={{ display: "none" }}
                                                accept="image/*"
                                                onChange={(event) => {
                                                  handleFileInputChange(
                                                    event,
                                                    itemInCategory.id!
                                                  );
                                                }}
                                                id={`fileInput-${itemInCategory.id}`}
                                              />
                                              <label
                                                htmlFor={`fileInput-${itemInCategory.id}`}
                                              >
                                                <Avatar>
                                                  {(itemInCategory.images ?? [])
                                                    .length > 0 ? (
                                                    <Image
                                                      src={
                                                        itemInCategory.images![0]
                                                          .url!
                                                      }
                                                    />
                                                  ) : (
                                                    <Add />
                                                  )}
                                                </Avatar>
                                              </label>
                                            </IconButton>
                                            <Box
                                              onClick={(event) =>
                                                event.stopPropagation()
                                              }
                                            >
                                              <Switch
                                                size="small"
                                                checked={
                                                  itemInCategory.moaEnabled ??
                                                  false
                                                }
                                                onChange={() => {
                                                  updateItemsMutation.mutateAsync(
                                                    [
                                                      {
                                                        id: itemInCategory.id!,
                                                        moaEnabled:
                                                          !itemInCategory.moaEnabled,
                                                      },
                                                    ]
                                                  );
                                                }}
                                              />
                                            </Box>
                                          </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                          <Paper elevation={6}>
                                            <List>
                                              {(
                                                itemInCategory.variations ?? []
                                              ).map(
                                                (variationInItemInCategory) => {
                                                  return (
                                                    <ListItem
                                                      key={
                                                        variationInItemInCategory.id
                                                      }
                                                      sx={{ px: 3 }}
                                                    >
                                                      <ListItemText
                                                        primary={
                                                          variationInItemInCategory.name
                                                        }
                                                      />
                                                      <Switch
                                                        checked={
                                                          variationInItemInCategory.moaEnabled ??
                                                          false
                                                        }
                                                        size="small"
                                                        onChange={() => {
                                                          updateVariationMutation.mutateAsync(
                                                            {
                                                              id: variationInItemInCategory.id!,
                                                              variationUpdateDto:
                                                                {
                                                                  moaEnabled:
                                                                    !variationInItemInCategory.moaEnabled,
                                                                },
                                                            }
                                                          );
                                                        }}
                                                      />
                                                    </ListItem>
                                                  );
                                                }
                                              )}
                                            </List>
                                          </Paper>
                                        </AccordionDetails>
                                      </Accordion>
                                    )}
                                  </Draggable>
                                )
                              )}
                              {provided.placeholder}
                            </List>
                          )}
                        </StrictModeDroppable>
                      </AccordionDetails>
                    </Accordion>
                  </Paper>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}
