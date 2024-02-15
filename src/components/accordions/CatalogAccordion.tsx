import { useGetSquareSyncMeMutation } from "@/networking/mutations/useGetSquareSyncMeMutation";
import { usePatchCategoriesMutation } from "@/networking/mutations/usePatchCategoriesMutation";
import { usePatchItemsMutation } from "@/networking/mutations/usePatchItemsMutation";
import { usePatchVariationMutation } from "@/networking/mutations/usePatchVariationMutation";
import { usePostItemSquareImageUploadMutation } from "@/networking/mutations/usePostItemSquareImageUploadMutation";
import { useGetCategoriesMeQuery } from "@/networking/queries/useGetCategoriesMeQuery";
import { StrictModeDroppable } from "@/utils/StrictModeDroppable";
import { logger } from "@/utils/logger";
import { Add, DragHandle, ExpandMore, Sync } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
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
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { Image } from "mui-image";
import { nanoid } from "nanoid";
import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { ErrorTextDialog } from "../dialogs/TextDialog";

export function CatalogAccordion() {
  const t = useTranslations("CatalogAccordion");

  const [showErrorDialogState, setShowErrorDialogState] =
    useState<boolean>(false);

  const [errorStringState, setErrorStringState] = useState<string | null>(null);

  const currentCatalogQuery = useGetCategoriesMeQuery();
  const currentCatalogCategories = currentCatalogQuery.data?.data ?? [];

  const patchItems = usePatchItemsMutation();
  const patchCategories = usePatchCategoriesMutation();
  const patchVariation = usePatchVariationMutation();
  const uploadImageToSquareCatalog = usePostItemSquareImageUploadMutation();

  const squareSyncMe = useGetSquareSyncMeMutation();

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

    patchCategories.mutateAsync(updatedCategoriesDtos);
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

    patchItems.mutateAsync(updatedItemsDtos);
  };

  const handleDragEnd = (result: DropResult) => {
    if (result.type === "category") {
      handleCategoryDragEnd(result);
    } else if (result.type.indexOf("item") !== -1) {
      handleItemDragEnd(result);
    }
  };

  async function handleFileInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) {
    logger.info("file input change");
    const files = event.target.files;
    if (!files || files.length === 0) {
      setErrorStringState(t("fileNotFoundError"));
      logger.error("fileNotFoundError");
      setShowErrorDialogState(true);
      return; // Handle error, perhaps show a user-friendly message
    }
    logger.info("found file");

    const file = files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (!validTypes.includes(file.type)) {
      setErrorStringState(t("invalidFileError"));
      logger.error("invalidFileError");
      setShowErrorDialogState(true);
      return; // Handle error
    }
    logger.info("valid file");

    if (file.size > 15 * 1024 * 1024) {
      setErrorStringState(t("fileTooLargeError"));
      logger.error("fileTooLargeError");
      setShowErrorDialogState(true);
      return; // Handle error
    }
    logger.info("within size");

    try {
      logger.info("uploading");
      await uploadImageToSquareCatalog.mutateAsync({
        id: itemId,
        file,
        idempotencyKey: nanoid(),
      });
      logger.info("uploaded");
    } catch (error) {
      logger.error(error);
      if (axios.isAxiosError(error)) {
        const message = (error?.response?.data as any)?.message;
        if (message !== undefined) {
          setErrorStringState(message);
          setShowErrorDialogState(true);
        }
      } else {
        setErrorStringState(JSON.stringify(error));
        setShowErrorDialogState(true);
      }
    }
  }

  return (
    <Fragment>
      <ErrorTextDialog
        open={showErrorDialogState}
        onClose={() => setShowErrorDialogState(false)}
        message={errorStringState ?? ""}
      />
      <Stack width="100%" gap={2}>
        <Box textAlign="center">
          <Tooltip title={t("syncButtonTooltip")}>
            <LoadingButton
              loading={squareSyncMe.isPending}
              startIcon={<Sync />}
              color="secondary"
              variant={squareSyncMe.isPending ? "contained" : "text"}
              onClick={() => squareSyncMe.mutateAsync()}
            >
              {t("syncButton")}
            </LoadingButton>
          </Tooltip>
        </Box>
        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="categories" type="category">
            {(provided) => (
              <Box
                sx={{ width: "100%" }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {currentCatalogCategories.map(
                  (currentCatalogCategory, index) => (
                    <Draggable
                      key={currentCatalogCategory.id!}
                      draggableId={`${currentCatalogCategory.id!}-draggableId`}
                      index={index}
                    >
                      {(provided) => (
                        <Paper
                          elevation={1}
                          sx={{ mb: 2 }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Accordion>
                            <AccordionSummary
                              expandIcon={
                                <Tooltip title={t("expandTooltip")}>
                                  <ExpandMore />
                                </Tooltip>
                              }
                              sx={{ mr: 2 }}
                            >
                              <Tooltip title={t("dragHandleTooltip")}>
                                <Box display="flex" alignItems="center">
                                  <IconButton disabled size="small">
                                    <DragHandle />
                                  </IconButton>
                                </Box>
                              </Tooltip>
                              <ListItemText
                                sx={{ display: "flex", flexGrow: 1 }}
                                primary={currentCatalogCategory.name}
                              />

                              <Box
                                display="flex"
                                alignItems="center"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <Tooltip title={t("switchTooltip")}>
                                  <Switch
                                    size="small"
                                    checked={
                                      currentCatalogCategory.moaEnabled ?? false
                                    }
                                    onChange={() => {
                                      patchCategories.mutateAsync([
                                        {
                                          id: currentCatalogCategory.id!,
                                          moaEnabled:
                                            !currentCatalogCategory.moaEnabled,
                                        },
                                      ]);
                                    }}
                                  />
                                </Tooltip>
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
                                              elevation={2}
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
                                                  <IconButton
                                                    disabled
                                                    size="small"
                                                  >
                                                    <DragHandle />
                                                  </IconButton>

                                                  <ListItemText
                                                    primary={
                                                      itemInCategory.name
                                                    }
                                                  />
                                                  <IconButton
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                  >
                                                    <input
                                                      type="file"
                                                      style={{
                                                        display: "none",
                                                      }}
                                                      accept="image/*"
                                                      onChange={(event) => {
                                                        logger.info(
                                                          "input onChange"
                                                        );
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
                                                        {(
                                                          itemInCategory.images ??
                                                          []
                                                        ).length > 0 ? (
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
                                                        (currentCatalogCategory.moaEnabled ??
                                                          false) &&
                                                        (itemInCategory.moaEnabled ??
                                                          false)
                                                      }
                                                      disabled={
                                                        !(
                                                          currentCatalogCategory.moaEnabled ??
                                                          false
                                                        )
                                                      }
                                                      onChange={() => {
                                                        patchItems.mutateAsync([
                                                          {
                                                            id: itemInCategory.id!,
                                                            moaEnabled:
                                                              !itemInCategory.moaEnabled,
                                                          },
                                                        ]);
                                                      }}
                                                    />
                                                  </Box>
                                                </Box>
                                              </AccordionSummary>
                                              <AccordionDetails>
                                                <Paper elevation={3}>
                                                  <List>
                                                    {(
                                                      itemInCategory.variations ??
                                                      []
                                                    ).map(
                                                      (
                                                        variationInItemInCategory
                                                      ) => {
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
                                                                (currentCatalogCategory.moaEnabled ??
                                                                  false) &&
                                                                (itemInCategory.moaEnabled ??
                                                                  false) &&
                                                                (variationInItemInCategory.moaEnabled ??
                                                                  false)
                                                              }
                                                              disabled={
                                                                !(
                                                                  (currentCatalogCategory.moaEnabled ??
                                                                    false) &&
                                                                  (itemInCategory.moaEnabled ??
                                                                    false)
                                                                )
                                                              }
                                                              size="small"
                                                              onChange={() => {
                                                                patchVariation.mutateAsync(
                                                                  {
                                                                    id: variationInItemInCategory.id!,
                                                                    variationPatchBody:
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
                  )
                )}
                {provided.placeholder}
              </Box>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </Stack>
    </Fragment>
  );
}
