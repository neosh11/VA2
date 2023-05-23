import React from "react";

const top_stats = [
  { name: "Number of Car Brands", stat: "71,897" },
  { name: "Number of Models", stat: "12,000" },
  { name: "XYZ", stat: "24.57%" },
];

function Intro() {
  return (
    <div className="w-full">
      Welcome to our dashboard... We have designed it to show you an exploration
      of the evolution of the car industry in the last 100 years.
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
    </div>
  );
}

export default Intro;
