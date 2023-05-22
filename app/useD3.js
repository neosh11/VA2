import React from "react";
import * as d3 from "d3";

export const useD3 = (renderChartFn, dependencies) => {
  const ref = React.useRef();
  const simulation = React.useRef();

  React.useEffect(() => {
    const sim = renderChartFn(d3.select(ref.current));
    simulation.current = sim;

    return () => {
      if (simulation.current) {
        simulation.current.stop();
      }
    };
  }, dependencies);

  return ref;
};
