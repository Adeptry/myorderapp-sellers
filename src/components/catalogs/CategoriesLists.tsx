import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Box, Paper, Skeleton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CatalogsApi,
  CatalogsApiFp,
  Category,
  CategoryUpdateAllDto,
  ItemUpdateAllDto,
  VariationUpdateDto,
} from "moa-merchants-ts-axios";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import CategoryList from "./CategoryList";

export function CategoriesLists(props: {
  onCatalogUpdate?: (categories: Category[]) => void;
}) {
  const { onCatalogUpdate } = props;
  const { configuration, status } = useSessionedApiConfiguration();
  const queryClient = useQueryClient();
  const getMyCatalogQueryKey = ["getMyCatalogQuery"];
  const getMyCatalogQuery = useQuery({
    queryKey: getMyCatalogQueryKey,
    queryFn: async () => {
      const catalogsApi = new CatalogsApi(configuration);
      return (
        await catalogsApi.getMyCatalog({
          items: true,
          images: true,
          variations: true,
          actingAs: "merchant",
        })
      ).data;
    },
    enabled: status === "authenticated",
  });
  const categories = getMyCatalogQuery.data?.data ?? [];
  useEffect(() => {
    onCatalogUpdate?.(categories);
  }, [categories]);

  const [currentCategoryIdState, setCurrentCategoryIdState] = useState<
    string | null
  >(null);
  const itemsInCategory =
    categories.find((value) => value.id === currentCategoryIdState)?.items ??
    [];

  const updateItemsMutation = useMutation({
    mutationFn: async (itemUpdateAllDto: Array<ItemUpdateAllDto>) => {
      return (
        await (
          await CatalogsApiFp(configuration).updateItems(itemUpdateAllDto)
        )()
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(getMyCatalogQueryKey);
    },
  });

  const updateCategoriesMutation = useMutation({
    mutationFn: async (categoryUpdateAllDto: Array<CategoryUpdateAllDto>) => {
      return (
        await (
          await CatalogsApiFp(configuration).updateCategories(
            categoryUpdateAllDto
          )
        )()
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(getMyCatalogQueryKey);
    },
  });

  const [currentItemIdState, setCurrentItemIdState] = useState<string | null>(
    null
  );

  const updateVariationMutation = useMutation({
    mutationFn: async (params: {
      id: string;
      variationUpdateDto: VariationUpdateDto;
    }) => {
      return (
        await CatalogsApiFp(configuration).updateVariation(
          params.id,
          params.variationUpdateDto
        )
      )();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(getMyCatalogQueryKey);
    },
  });
  const variationsInItem =
    itemsInCategory.find((value) => value.id === currentItemIdState)
      ?.variations ?? [];

  const uploadImageToSquareCatalogMutation = useMutation({
    mutationFn: async (params: {
      idempotencyKey: string;
      id: string;
      file?: File;
    }) => {
      return (
        await CatalogsApiFp(configuration).uploadImageToSquareCatalog(
          params.idempotencyKey,
          params.id,
          params.file
        )
      )();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(getMyCatalogQueryKey);
    },
  });

  async function onObjectImageUpdate(id: string, file: File): Promise<void> {
    await uploadImageToSquareCatalogMutation.mutateAsync({
      id,
      file,
      idempotencyKey: nanoid(),
    });
  }

  async function onCategoryMove(id: string, up: boolean) {
    const index = categories.findIndex((category) => category.id === id);

    if (
      index !== -1 &&
      !(up && index === 0) &&
      !(!up && index === categories.length - 1)
    ) {
      const category1 = categories[index];
      const category2 = categories[index + (up ? -1 : 1)];
      const category1Id = category1.id;
      const category2Id = category2.id;
      const category1NewOrdinal = category2.moaOrdinal;
      const category2NewOrdinal = category1.moaOrdinal;

      await updateCategoriesMutation.mutateAsync([
        { id: category1Id!, moaOrdinal: category1NewOrdinal },
        { id: category2Id!, moaOrdinal: category2NewOrdinal },
      ]);
    }
  }

  async function onItemMove(id: string, up: boolean) {
    const index = itemsInCategory.findIndex((item) => item.id === id);

    if (
      index !== -1 &&
      !(up && index === 0) &&
      !(!up && index === itemsInCategory.length - 1)
    ) {
      const item1 = itemsInCategory[index];
      const item2 = itemsInCategory[index + (up ? -1 : 1)];
      const item1Id = item1.id;
      const item2Id = item2.id;
      const item1NewOrdinal = item2.moaOrdinal;
      const item2NewOrdinal = item1.moaOrdinal;

      if (
        item1Id &&
        item2Id &&
        item1NewOrdinal !== undefined &&
        item2NewOrdinal !== undefined
      ) {
        await updateItemsMutation.mutateAsync([
          { id: item1Id, moaOrdinal: item1NewOrdinal },
          { id: item2Id, moaOrdinal: item2NewOrdinal },
        ]);
      }
    }
  }

  async function onCategoryUpdate(id: string, moaEnabled: boolean) {
    const index = categories.findIndex((category) => category.id === id);

    if (index !== -1) {
      const category = categories[index];
      if (category.moaEnabled != moaEnabled && category.id !== undefined) {
        const newCategory = {
          ...category,
          moaEnabled: moaEnabled,
        };

        await updateCategoriesMutation.mutateAsync([
          {
            id: newCategory.id!,
            moaEnabled: newCategory.moaEnabled,
          },
        ]);
      }
    }
  }

  function onItemUpdate(id: string, moaEnabled: boolean): void {
    const index = itemsInCategory.findIndex((value) => value.id === id);

    if (index !== -1) {
      const item = itemsInCategory[index];
      if (item.moaEnabled != moaEnabled && item.id !== undefined) {
        const newItem = {
          ...item,
          moaEnabled: moaEnabled,
        };

        updateItemsMutation.mutateAsync([
          {
            id: newItem.id!,
            moaEnabled: newItem.moaEnabled,
          },
        ]);
      }
    }
  }

  function onVariationUpdate(id: string, moaEnabled: boolean): void {
    const index = variationsInItem.findIndex((value) => value.id === id);

    if (index !== -1) {
      const variation = variationsInItem[index];
      if (variation.moaEnabled != moaEnabled && variation.id !== undefined) {
        const newVariation = {
          ...variation,
          moaEnabled: moaEnabled,
        };

        updateVariationMutation.mutateAsync({
          id: newVariation.id!,
          variationUpdateDto: { moaEnabled: newVariation.moaEnabled },
        });
      }
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      {status === "loading" &&
        Array(8)
          .fill(null)
          .map((_, i) => <Skeleton key={i} height={"88px"} />)}
      {!(status === "loading") && (
        <Flipper
          flipKey={categories.map((v) => v.id).join("")}
          portalKey="categories"
        >
          {categories.map((entity) => {
            return (
              <Flipped key={entity.id} flipId={entity.id ?? ""}>
                <Paper elevation={2} sx={{ mb: 2 }}>
                  <CategoryList
                    onCategoryMove={onCategoryMove}
                    entity={entity}
                    isIn={currentCategoryIdState === entity.id}
                    isFirst={categories[0].id === entity.id}
                    isLast={categories[categories.length - 1].id === entity.id}
                    setIsIn={(open) => {
                      setCurrentCategoryIdState(
                        open ? entity.id ?? null : null
                      );
                    }}
                    getItems={(itemId) => {
                      setCurrentItemIdState(itemId);
                    }}
                    items={itemsInCategory}
                    onItemMove={onItemMove}
                    variations={variationsInItem}
                    getVariations={(itemId) => {
                      setCurrentItemIdState(itemId);
                    }}
                    onVariationUpdate={onVariationUpdate}
                    onItemUpdate={onItemUpdate}
                    onCategoryUpdate={onCategoryUpdate}
                    onObjectImageUpdate={onObjectImageUpdate}
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
