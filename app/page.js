"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

import rd3 from "react-d3-library";

import BarChart from "./charts/chart";
import Blobs from "./charts/bubbles";
import SunBurst from "./charts/sunburst";
import { sunburst_data } from "./data/sunburst";
import WorldMap from "./charts/cloro";
import Intro from "./charts/intro";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


const tabs = [
  { name: "Introduction", id: "intro" },
  { name: "Models by Country", id: "sunburst" },
  { name: "Yours", id: "yours" },
  { name: "Yours", id: "yours" },
  { name: "Yours", id: "yours" },
];

function Navigation({ selectedTab = "intro", setselectedTab }) {
  return (
    <div>
      <div>
        <nav
          className="isolate divide-gray-200 grid grid-cols-1 md:grid-cols-2"
          aria-label="Tabs"
        >
          {tabs.map((tab, tabIdx) => (
            <button
              onClick={() => setselectedTab(tab.id)}
              key={tab.name}
              className={classNames(
                tab.id == selectedTab
                  ? "text-gray-900 border-gray-400"
                  : "text-gray-500 hover:text-gray-700 border-gray-100",
                "border-2 rounded-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
              )}
              aria-current={tab.current ? "page" : undefined}
            >
              <span>{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  tab.current ? "bg-indigo-500" : "bg-transparent",
                  "absolute inset-x-0 bottom-0 h-0.5"
                )}
              />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function SelectedGraph({ selectedTab = "sunburst" }) {
  if (selectedTab == "sunburst") {
    return <SunBurst data={sunburst_data} />;
  }
  if (selectedTab == "yours") {
    return (
      <Blobs
        data={[
          { r: 5.148585196204891, group: 0 },
          { r: 12.165799682522458, group: 2 },
          { r: 17.28646310018443, group: 3 },
          { r: 13.106289115828547, group: 4 },
          { r: 10.424400994182266, group: 1 },
          { r: 10.93892343253752, group: 2 },
        ]}
      />
    );
  }
  if (selectedTab == "intro") {
    return <Intro />;
  }
}

export default function Home() {
  const [selectedTab, setselectedTab] = useState("sunburst");
  return (
    <>
      <div className="w-full md:w-4/5 m-auto space-y-2 py-16 sm:py-24">
        <div className="flex justify-center text-base font-semibold leading-6 text-gray-900">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dashboard
          </h1>
        </div>


        <Navigation selectedTab={selectedTab} setselectedTab={setselectedTab} />

        <div className="w-full border-2 p-5 rounded-lg">
          <SelectedGraph selectedTab={selectedTab} />
        </div>
      </div>
    </>
  );
}
