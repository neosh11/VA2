"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import rd3 from "react-d3-library";

import BarChart from "./chart";
import Blobs from "./sunburst";
const RD3Component = rd3.Component;

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const top_stats = [
  { name: "Number of Car Brands", stat: "71,897" },
  { name: "Number of Models", stat: "12,000" },
  { name: "XYZ", stat: "24.57%" },
];

export default function Home() {
  return (
    <>
      <h1 className="text-base font-semibold leading-6 text-gray-900">
        Dashboard
      </h1>
      <div>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {top_stats.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                {item.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {item.stat}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="w-100">
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

        <>
          <BarChart
            data={[
              { year: 1980, efficiency: 24.3, sales: 8949000 },
              { year: 1982, efficiency: 23.3, sales: 8949000 },
              { year: 1983, efficiency: 26.3, sales: 8949000 },
            ]}
          />
        </>
      </div>
    </>
  );
}
