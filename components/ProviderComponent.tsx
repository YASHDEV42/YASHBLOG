"use client";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
const ProviderComponent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  if (!isLoaded) return <div>Loading...</div>;
  return <Provider store={store}>{children}</Provider>;
};

export default ProviderComponent;
