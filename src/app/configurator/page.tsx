"use client";

import { useNetworkingContext } from "@/components/NetworkingProvider";
import useRequestState from "@/utils/useRequestState";
import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { Merchant } from "moa-merchants-ts-axios";
import { useEffect, useState } from "react";

export default function Page() {
  const { merchants } = useNetworkingContext();

  const [{ data, loading, error }, setRequestState] = useRequestState<Merchant>(
    { loading: true }
  );

  const [testState, setTestState] = useState("test");

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
    <Grid container sx={{ minHeight: "90vh" }}>
      <Grid xs={4} item>
        <TextField
          id="outlined-controlled"
          label="Controlled"
          value={testState}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTestState(event.target.value);
          }}
        />
        <Button
          onClick={() => {
            const iframe = document.getElementById(
              "flutter-iframe"
            ) as HTMLIFrameElement;
            iframe.contentWindow!.postMessage({ index: testState }, "*");
          }}
        >
          Test
        </Button>
      </Grid>
      <Grid xs={8} item>
        <iframe
          id="flutter-iframe"
          src="https://moa-cafe.web.app/"
          style={{ width: "100%", height: "100%" }}
        />
      </Grid>
    </Grid>
  );
}
