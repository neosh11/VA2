import Image from "next/image";
import React from "react";

const top_stats = [
  { name: "Number of Car Brands", stat: "71,897" },
  { name: "Number of Models", stat: "12,000" },
  { name: "XYZ", stat: "24.57%" },
];

function WorldEvolution() {
  return (
    <div className="w-full">
      Animation of which countries made the most models over time...
      {/* render a gif */}
      {/* make an image maintain aspect ratio but fill width */}
      <Image
        src="/car_anim.gif"
        alt="How cars evolved"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }} // optional
      />
    </div>
  );
}

export default WorldEvolution;
