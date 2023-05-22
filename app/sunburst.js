import { useD3 } from "./useD3";
import React from "react";
import * as d3 from "d3";

function Blobs({ data }) {
  const ref = useD3(
    (svg) => {
      const width = 1000;
      const height = 1000;
      const context = svg.node().getContext("2d");

      const nodes = data.map(Object.create);

      const simulation = d3
        .forceSimulation(nodes)
        .alphaTarget(0.3) // stay hot
        .velocityDecay(0.1) // low friction
        .force("x", d3.forceX().strength(0.1))
        .force("y", d3.forceY().strength(0.1))
        .force(
          "collide",
          d3
            .forceCollide()
            .radius((d) => d.r + 1)
            .iterations(3)
        )
        .force(
          "charge",
          d3.forceManyBody().strength((d, i) => (i ? 0 : (-width * 2) / 3))
        )
        .on("tick", ticked);

      d3.select(context.canvas)
        .on("touchmove", (event) => event.preventDefault())
        .on("pointermove", pointed);

      function pointed(event) {
        const [x, y] = d3.pointer(event);
        nodes[0].fx = x - width / 2;
        nodes[0].fy = y - height / 2;
      }
      function ticked() {
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(width / 2, height / 2);
        for (const d of nodes) {
          context.beginPath();
          context.moveTo(d.x + d.r, d.y);
          context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
          // context.fillStyle = color(d.group);
          context.fill();
        }
        context.restore();
      }
      return simulation;
    },
    [data.length]
  );

  return <canvas ref={ref} width={1000} height={1000}></canvas>;
}

export default Blobs;
