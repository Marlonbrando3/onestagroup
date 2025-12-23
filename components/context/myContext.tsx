import React, { createContext, useState, useContext } from "react";

interface Cont {
  children: React.ReactNode;
}

const defaultValue = {
  page: 1,
};

const MyContext: any = createContext(defaultValue);

export const MyContextProvider = ({ children }: Cont) => {
  const [PageNumber, setPageNumber] = useState();

  return <MyContext.Provider value={{ PageNumber, setPageNumber }}>{children}</MyContext.Provider>;
};

export const useMyContext = () => useContext(MyContext);
