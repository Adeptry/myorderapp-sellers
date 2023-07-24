import { useContext } from "react";
import { NetworkingContext } from "./NetworkingContext";

export const useNetworkingContext = () => {
  const context = useContext(NetworkingContext);

  if (context === undefined) {
    throw new Error(
      "useNetworkingContext must be used within a NetworkingProvider"
    );
  }

  return context;
};
