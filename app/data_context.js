import React, { createContext, useEffect, useState } from "react";
import * as d3 from "d3";
import Dexie from "dexie";

export const MyContext = createContext();

const db = new Dexie("MyDatabase");
db.version(1).stores({
  csvData: "++id, data",
});

export const MyContextProvider = ({ children }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      let data;
      const cachedData = await db.csvData.toArray();

      console.log("cachedData", cachedData);

      if (cachedData.length === 0) {
        // fetch and save to IndexedDB
        const response = await d3.csv("https://va-2.vercel.app/cleaned.csv");
        data = response;
        db.csvData.put({ data: response });
      } else {
        // use data from IndexedDB
        data = cachedData[0].data;
      }

      console.log("data: ", data);
      setValue(data);
    };

    loadData();
  }, []);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
