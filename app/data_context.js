import React, { createContext, useEffect, useState } from "react";
import * as d3 from "d3";
// Create a new context
export const MyContext = createContext();

// Create a context provider component
export const MyContextProvider = ({ children }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    d3.csv("http://localhost:3000/cleaned.csv").then((response) => {
      console.log("hahah");
      console.log(response);
      setValue(response);
    });
  }, []);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
