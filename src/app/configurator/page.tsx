"use client";

import { useNetworkingContext } from "@/components/NetworkingProvider";
import useRequestState from "@/utils/useRequestState";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Merchant } from "moa-merchants-ts-axios";
import { default as NextLink } from "next/link";
import { useEffect, useState } from "react";
import { routes } from "../routes";

export default function Page() {
  const { merchants } = useNetworkingContext();

  const [{ data, loading, error }, setRequestState] = useRequestState<Merchant>(
    { loading: true }
  );

  const [titleState, setTitleState] = useState("Your App Name");
  const [indexState, setIndexState] = useState("0");

  useEffect(() => {
    async function fetch() {
      try {
        const response = await merchants.getCurrentMerchant();
        setRequestState({
          data: response?.data,
          loading: false,
          error: undefined,
        });
      } catch (error) {
        setRequestState({
          data: undefined,
          loading: false,
          error: axios.isAxiosError(error) ? error.response?.data : error,
        });
      }
    }

    fetch();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <Grid container sx={{ minHeight: "90vh" }} spacing={2}>
      <Grid xs={4} item>
        <Stack>
          <TextField
            id="outlined-controlled"
            label="App Name"
            fullWidth
            value={titleState}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTitleState(event.target.value);
              const iframe = document.getElementById(
                "flutter-iframe"
              ) as HTMLIFrameElement;
              iframe.contentWindow!.postMessage(
                { title: event.target.value },
                "*"
              );
            }}
          />
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Color</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              value={indexState}
              onChange={(event) => {
                setIndexState((event.target as HTMLInputElement).value);
                const iframe = document.getElementById(
                  "flutter-iframe"
                ) as HTMLIFrameElement;
                iframe.contentWindow!.postMessage(
                  { index: event.target.value },
                  "*"
                );
              }}
            >
              <FormControlLabel value="0" control={<Radio />} label="Default" />
              <FormControlLabel value="1" control={<Radio />} label="Indigo" />
              <FormControlLabel value="2" control={<Radio />} label="Blue" />
              <FormControlLabel value="3" control={<Radio />} label="Teal" />
              <FormControlLabel value="4" control={<Radio />} label="Green" />
              <FormControlLabel value="5" control={<Radio />} label="Yellow" />
              <FormControlLabel value="6" control={<Radio />} label="Orange" />
              <FormControlLabel
                value="7"
                control={<Radio />}
                label="Deep Orange"
              />
              <FormControlLabel value="8" control={<Radio />} label="Pink" />
            </RadioGroup>
          </FormControl>
          <Button href={routes.square} component={NextLink} variant="contained">
            Done
          </Button>
        </Stack>
      </Grid>
      <Grid xs={8} item>
        <Stack height="100%">
          <Typography variant="h4" component="h1" gutterBottom>
            Preview
          </Typography>
          <iframe
            frameBorder="0"
            id="flutter-iframe"
            src="https://moa-cafe.web.app/"
            style={{ width: "100%", height: "100%" }}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}
