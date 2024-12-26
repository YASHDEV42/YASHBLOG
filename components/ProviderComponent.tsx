"use client";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Spinner from "./Spinner";
const ProviderComponent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  if (!isLoaded) return <Spinner />;
  return <Provider store={store}>{children}</Provider>;
};

export default ProviderComponent;
