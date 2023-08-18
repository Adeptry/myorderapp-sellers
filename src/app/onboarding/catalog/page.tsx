"use client";

import { routes } from "@/app/routes";
import OnboardingStepper, {
  OnboardingSteps,
} from "@/components/OnboardingStepper";
import { CategoriesLists } from "@/components/catalogs/CategoriesLists";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { useNetworkingFunctionP } from "@/components/networking/useNetworkingFunctionP";
import { ThumbUp } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { Category, Item, Variation } from "moa-merchants-ts-axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { push } = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { catalogs } = useNetworkingContext();

  const [categoriesState, setCategoriesState] = useState<Category[]>([]);
  const [{ loading: getCategoriesLoading }, getMyCatalogFn] =
    useNetworkingFunctionP(catalogs.getMyCatalog.bind(catalogs), true);
  const [{}, updateCategories] = useNetworkingFunctionP(
    catalogs.updateCategories.bind(catalogs),
    false
  );

  const [itemsState, setItemsState] = useState<Item[]>([]);
  const [, getItemsInCategoryFn] = useNetworkingFunctionP(
    catalogs.getItemsInCategory.bind(catalogs),
    false
  );
  const [, updateItemsFn] = useNetworkingFunctionP(
    catalogs.updateItems.bind(catalogs),
    false
  );
  const [variationsState, setVariationsState] = useState<Variation[]>([]);
  const [, getVariationsForItemFn] = useNetworkingFunctionP(
    catalogs.getVariationsForItem.bind(catalogs),
    false
  );
  const [, updateVariationFn] = useNetworkingFunctionP(
    catalogs.updateVariation.bind(catalogs),
    false
  );

  useEffect(() => {
    getTheCategories();
  }, []);

  const [errorString, setErrorString] = useState<string | null>(null);

  async function getTheCategories() {
    try {
      const response = await getMyCatalogFn(
        {
          actingAs: "merchant",
        },
        {}
      );
      setCategoriesState(response.data.data ?? []);
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 422) {
        const message = (error?.response?.data as any).message;
        if (typeof message === "string") {
          setErrorString(message);
        } else {
          setErrorString("There was an error. Please try again.");
        }
      } else {
        setErrorString("There was an error. Please try again.");
      }
    }
  }

  async function getItems(categoryId: string) {
    const response = await getItemsInCategoryFn(
      {
        actingAs: "merchant",
        id: categoryId,
      },
      {}
    );
    setItemsState(response.data.data ?? []);
  }

  async function getVariations(itemId: string) {
    const response = await getVariationsForItemFn(
      {
        id: itemId,
      },
      {}
    );
    setVariationsState(response.data ?? []);
  }

  async function onCategoryMove(id: string, up: boolean) {
    const index = categoriesState.findIndex((category) => category.id === id);

    if (
      index !== -1 &&
      !(up && index === 0) &&
      !(!up && index === categoriesState.length - 1)
    ) {
      const category1 = categoriesState[index];
      const category2 = categoriesState[index + (up ? -1 : 1)];
      const category1Id = category1.id;
      const category2Id = category2.id;
      const category1NewOrdinal = category2.moaOrdinal;
      const category2NewOrdinal = category1.moaOrdinal;

      if (
        category1Id &&
        category2Id &&
        category1NewOrdinal !== undefined &&
        category2NewOrdinal !== undefined
      ) {
        const result = await updateCategories(
          {
            categoryUpdateAllDto: [
              { id: category1Id, moaOrdinal: category1NewOrdinal },
              { id: category2Id, moaOrdinal: category2NewOrdinal },
            ],
          },
          {}
        );

        const data = result.data;

        setCategoriesState((prevState) =>
          prevState
            .map((category) => {
              if (category.id === data[0].id) {
                return data[0];
              } else if (category.id === data[1].id) {
                return data[1];
              } else {
                return category;
              }
            })
            .sort((a, b) => (a.moaOrdinal ?? 0) - (b.moaOrdinal ?? 0))
        );
      }
    }
  }

  async function onItemMove(id: string, up: boolean) {
    const index = itemsState.findIndex((item) => item.id === id);

    if (
      index !== -1 &&
      !(up && index === 0) &&
      !(!up && index === itemsState.length - 1)
    ) {
      const item1 = itemsState[index];
      const item2 = itemsState[index + (up ? -1 : 1)];
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
        const result = await updateItemsFn(
          {
            itemUpdateAllDto: [
              { id: item1Id, moaOrdinal: item1NewOrdinal },
              { id: item2Id, moaOrdinal: item2NewOrdinal },
            ],
          },
          {}
        );

        const data = result.data;

        setItemsState((prevState) =>
          prevState
            .map((item) => {
              if (item.id === data[0].id) {
                return data[0];
              } else if (item.id === data[1].id) {
                return data[1];
              } else {
                return item;
              }
            })
            .sort((a, b) => (a.moaOrdinal ?? 0) - (b.moaOrdinal ?? 0))
        );
      }
    }
  }

  function onCategoryUpdate(id: string, moaEnabled: boolean): void {
    const index = categoriesState.findIndex((category) => category.id === id);

    if (index !== -1) {
      const category = categoriesState[index];
      if (category.moaEnabled != moaEnabled && category.id !== undefined) {
        const newCategory = {
          ...category,
          moaEnabled: moaEnabled,
        };

        setCategoriesState((prevState) =>
          prevState.map((category) => {
            if (category.id === newCategory.id) {
              return newCategory;
            } else {
              return category;
            }
          })
        );

        updateCategories(
          {
            categoryUpdateAllDto: [
              {
                id: newCategory.id!,
                moaEnabled: newCategory.moaEnabled,
              },
            ],
          },
          {}
        );
      }
    }
  }

  function onItemUpdate(id: string, moaEnabled: boolean): void {
    const index = itemsState.findIndex((value) => value.id === id);

    if (index !== -1) {
      const item = itemsState[index];
      if (item.moaEnabled != moaEnabled && item.id !== undefined) {
        const newItem = {
          ...item,
          moaEnabled: moaEnabled,
        };

        setItemsState((prevState) =>
          prevState.map((value) => {
            if (value.id === newItem.id) {
              return newItem;
            } else {
              return value;
            }
          })
        );

        updateItemsFn(
          {
            itemUpdateAllDto: [
              {
                id: newItem.id!,
                moaEnabled: newItem.moaEnabled,
              },
            ],
          },
          {}
        );
      }
    }
  }

  function onVariationUpdate(id: string, moaEnabled: boolean): void {
    const index = variationsState.findIndex((value) => value.id === id);

    if (index !== -1) {
      const variation = variationsState[index];
      if (variation.moaEnabled != moaEnabled && variation.id !== undefined) {
        const newVariation = {
          ...variation,
          moaEnabled: moaEnabled,
        };

        setVariationsState((prevState) =>
          prevState.map((value) => {
            if (value.id === newVariation.id) {
              return newVariation;
            } else {
              return value;
            }
          })
        );

        updateVariationFn(
          {
            id: newVariation.id!,
            variationUpdateDto: {
              moaEnabled: moaEnabled,
            },
          },
          {}
        );
      }
    }
  }

  const preloading = getCategoriesLoading;

  return (
    <Stack spacing={2} py={2}>
      {preloading ? (
        <Skeleton height={"24px"} />
      ) : (
        <OnboardingStepper
          activeStep={OnboardingSteps.square}
          sx={{ width: "100%" }}
        />
      )}
      {errorString && (
        <Alert severity="error" style={{ width: "100%" }}>
          {errorString}
        </Alert>
      )}
      {categoriesState && (
        <Grid
          container
          columnSpacing={isSmallScreen ? 0 : 2}
          direction={isSmallScreen ? "column-reverse" : "row"}
        >
          <Grid item xs={12} sm={12} md={6}>
            <CategoriesLists
              preloading={preloading}
              entities={categoriesState}
              items={itemsState}
              variations={variationsState}
              getItems={getItems}
              getVariations={getVariations}
              onCategoryMove={onCategoryMove}
              onItemMove={onItemMove}
              onCategoryUpdate={onCategoryUpdate}
              onItemUpdate={onItemUpdate}
              onVariationUpdate={onVariationUpdate}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Stack
              spacing={2}
              pt={1}
              pb={2}
              alignItems={"center"}
              textAlign={"center"}
            >
              {preloading ? (
                <Skeleton height={"24px"} width={"100%"} />
              ) : (
                <Typography variant="h4">Prepare your catalog</Typography>
              )}

              {preloading ? (
                <>
                  <Skeleton height={"24px"} width={"100%"} />
                  <Skeleton height={"24px"} width={"100%"} />
                  <Skeleton height={"24px"} width={"100%"} />
                  <Skeleton height={"24px"} width={"100%"} />
                  <Skeleton height={"24px"} width={"100%"} />
                </>
              ) : (
                <Typography variant="body1">
                  Here, you can manage and tailor your Catalog Items as desired.
                  Any modifications made in Square are synchronized with this
                  dashboard (just refresh) and your app, guaranteeing your
                  customers access to the most current data. You can re-order,
                  selectively enable items just in the app, or adjust your
                  catalog according at any point -{" "}
                  <strong>before or after app launch!</strong>
                </Typography>
              )}

              {preloading ? (
                <Skeleton height={"24px"} width={"100%"} />
              ) : (
                <Typography variant="body1">
                  When set, click the button below to subscribe and initiate app
                  publishing.
                </Typography>
              )}

              <Box width="auto" display="inline-block">
                {preloading ? (
                  <Skeleton height={"42px"} width={"100px"} />
                ) : (
                  <Button
                    size="large"
                    variant="contained"
                    color="secondary"
                    startIcon={<ThumbUp />}
                    onClick={() => {
                      push(routes.onboarding.stripe.index);
                    }}
                  >
                    I'm ready
                  </Button>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}
