import { useD3 } from "../useD3";

// import {Swatches} from "d3/color-legend"
// import {howto, altplot} from "d3/example-components"
import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useContainerSize } from "../useContainerSize";
import { MyContext } from "../data_context";

function Tree(
  data,
  {
    // data is either tabular (array of objects) or hierarchy (nested objects)
    path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
    id = Array.isArray(data) ? (d) => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
    parentId = Array.isArray(data) ? (d) => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
    children, // if hierarchical data, given a d in data, returns its children
    tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
    sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
    label, // given a node d, returns the display name
    title, // given a node d, returns its hover text
    link, // given a node d, its link (if any)
    svg,
    linkTarget = "_blank", // the target attribute for links (if any)
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    r = 3, // radius of nodes
    padding = 1, // horizontal padding for first and last column
    fill = "#999", // fill for nodes
    fillOpacity, // fill opacity for nodes
    stroke = "#555", // stroke for links
    strokeWidth = 1.5, // stroke width for links
    strokeOpacity = 0.4, // stroke opacity for links
    strokeLinejoin, // stroke line join for links
    strokeLinecap, // stroke line cap for links
    halo = "#fff", // color of label halo
    haloWidth = 3, // padding around the labels
    curve = d3.curveBumpX, // curve for the link
  } = {}
) {
  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.
  const root =
    path != null
      ? d3.stratify().path(path)(data)
      : id != null || parentId != null
      ? d3.stratify().id(id).parentId(parentId)(data)
      : d3.hierarchy(data, children);

  // Sort the nodes.
  if (sort != null) root.sort(sort);

  // Compute labels and titles.
  const descendants = root.descendants();
  const L = label == null ? null : descendants.map((d) => label(d.data, d));

  // Compute the layout.
  const dx = 10;
  const dy = width / (root.height + padding);
  tree().nodeSize([dx, dy])(root);

  // Center the tree.
  let x0 = Infinity;
  let x1 = -x0;
  root.each((d) => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  // Compute the default height.
  console.log("height");
  console.log(height);
  if (height === undefined) height = x1 - x0 + dx * 2;

  // Use the required curve
  if (typeof curve !== "function") throw new Error(`Unsupported curve`);

  svg
    .attr("viewBox", [(-dy * padding) / 2, x0 - dx, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10);

  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-linecap", strokeLinecap)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("stroke-width", strokeWidth)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr(
      "d",
      d3
        .link(curve)
        .x((d) => d.y)
        .y((d) => d.x)
    );

  const node = svg
    .append("g")
    .selectAll("a")
    .data(root.descendants())
    .join("a")
    .attr("xlink:href", link == null ? null : (d) => link(d.data, d))
    .attr("target", link == null ? null : linkTarget)
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  node
    .append("circle")
    .attr("fill", (d) => (d.children ? stroke : fill))
    .attr("r", r);

  if (title != null) node.append("title").text((d) => title(d.data, d));

  if (L)
    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => (d.children ? -6 : 6))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("paint-order", "stroke")
      .attr("stroke", halo)
      .attr("stroke-width", haloWidth)
      .text((d, i) => L[i]);

  return svg.node();
}

function Evolution() {
  const containerRef = useRef(null);
  const { width, height } = useContainerSize(containerRef);
  const raww = useContext(MyContext);
  const [selectedMake, setselectedMake] = useState("audi");

  let makeSelector = null;
  if (raww) {
    // generate options based on the makes in inside raww
    const makes = new Set(raww.map((d) => d.make));
    // make the react selector
    makeSelector = (
      <select
        value={selectedMake}
        onChange={(e) => {
          console.log(e.target.value);
          setselectedMake(e.target.value);
        }}
      >
        {Array.from(makes).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    );
  }

  const ref = useD3(
    (svg) => {
      svg.selectAll("*").remove();

      console.log(width, height);

      if (!raww) return;

      //  filter everything with selectedMake

      const raw = raww.filter((d) => d.make === selectedMake);

      // get all the column names from raw

      const columns = raww.columns;

      let groups = raw.reduce(function (acc, row) {
        // Construct the group key
        let key = `${row.make}-${row.model}-${row.generation}-${row.year_from}-${row.year_to}`;

        // If the group doesn't exist, create it
        if (!acc[key]) {
          acc[key] = [];
        }

        // loop through every column

        // Add the row to the group
        acc[key].push(row); // convert string to number

        return acc;
      }, {});

      console.log(groups);

      for (let key in groups) {
        let valuesInit = groups[key];
        // values contains every row that belongs to the group
        const keys = Object.keys(valuesInit[0]);
        // create a new object with the same keys
        const obj = {};

        // loop through every key
        for (let i = 0; i < keys.length; i++) {
          // get the key
          let key = keys[i];
          // loop through every row of the group and get the key value
          let values = valuesInit.map((d) => d[key]);
          // filter empty values
          values = values.filter((d) => d !== "");
          // get the median of the values
          let median;
          values.sort((a, b) => a - b);
          if (values.length % 2 === 0) {
            // even length
            let mid = values.length / 2;
            median = values[mid - 1];
          } else {
            // odd length
            let mid = Math.floor(values.length / 2);
            median = values[mid];
          }
          // add the key and the median to the object
          obj[key] = median;
        }

        console.log(obj);

        groups[key] = obj;
      }

      raw.sort(function (a, b) {
        return a.year_from - b.year_from;
      });

      // get all values in groups

      const group_values = Object.values(groups);

      console.log(
        group_values.map((d) => {
          return {
            year_from: d.year_from,
            year_to: d.year_to,
            make: d.make,
            model: d.model,
            generation: d.generation,
          };
        })
      );

      group_values.sort((a, b) => {
        if (a.model === b.model) {
          return a.year_from - b.year_from;
        }
        return a.model.localeCompare(b.model);
      });

      console.log("group_values");
      console.log(group_values);

      let hierarchicalData = [];
      let currentNode = null;

      group_values.forEach((item) => {
        // Create new node

        let node = {
          name: item.generation,
          model: item.model,

          year_from: item.year_from,
          year_to: item.year_to,
          children: [],
        };

        console.log("item", currentNode && currentNode.model, node.model);
        console.log(item);

        if (currentNode && currentNode.model === node.model) {
          // If current model is same as the item's model, append to the current model's tree

          currentNode.children.push(node);
        } else {
          // Else, create a new model node
          const currentModelNode = {
            name: item.model,
            children: [node],
          };
          hierarchicalData.push(currentModelNode);
        }
        currentNode = node;
      });

      console.log(group_values);

      // add a rooth tot his data
      const rootNode = {
        name: "root",
        year_from: "1900",
        year_to: "1900",
        children: hierarchicalData,
      };

      console.log(hierarchicalData);

      Tree(rootNode, {
        label: (d) => d.name,
        title: (d, n) =>
          `${n
            .ancestors()
            .reverse()
            .map((d) => d.data.name)
            .join(".")}`, // hover text
        link: (d, n) =>
          `https://github.com/prefuse/Flare/${
            n.children ? "tree" : "blob"
          }/master/flare/src/${n
            .ancestors()
            .reverse()
            .map((d) => d.data.name)
            .join("/")}${n.children ? "" : ".as"}`,
        sort: (a, b) => d3.descending(a.height, b.height), // reduce link crossings
        tree: d3.cluster,
        width: width,
        height: height,
        svg,
      });

      // const makes = new Set(raw.map((d) => d.make));

      // //  DO the d3js magic here
      // // Initialize an empty array to hold the data

      // const tree = d3.tree().size([height, width]);

      // // Apply the root data to the tree layout
      // let root = d3.hierarchy(rootNode, (d) => d.children);
      // tree(root);

      // // rearrange
      // let yScale = d3
      //   .scaleLinear()
      //   .domain([
      //     d3.min(root.descendants(), (d) => {
      //       return 1890.0;
      //     }),
      //     d3.max(root.descendants(), (d) => {
      //       console.log(d.data.year_from, "efsdcsdavsd");
      //       return 2030.0;
      //     }),
      //   ])
      //   .range([0, height]);

      // // Adjust y positions based on year_from
      // root.descendants().forEach((d) => {
      //   d.y = yScale(d.data.year_from);
      // });

      // // Append the svg object to the body of the page
      // const margin = { top: 20, right: 200, bottom: 30, left: 200 };

      // svg.selectAll("*").remove();

      // svg
      //   .attr("width", width + margin.right + margin.left)
      //   .attr("height", height + margin.top + margin.bottom)
      //   .append("g")
      //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // // Declare a function to generate the links between nodes
      // const link = d3
      //   .linkVertical()
      //   .x((d) => d.x)
      //   .y((d) => d.y);

      // // Add the links
      // svg
      //   .selectAll(".link")
      //   .data(root.links())
      //   .enter()
      //   .append("path")
      //   .attr("class", "link")
      //   .attr("d", link);

      // // Add each node as a group
      // const node = svg
      //   .selectAll(".node")
      //   .data(root.descendants())
      //   .enter()
      //   .append("g")
      //   .attr("class", function (d) {
      //     return "node" + (d.children ? " node--internal" : " node--leaf");
      //   })
      //   .attr("transform", function (d) {
      //     return "translate(" + d.x + "," + d.y + ")";
      //   });

      // // Add the circle for this node
      // node.append("circle").attr("r", 10);

      // // Add the text for this node
      // node
      //   .append("text")
      //   .attr("dy", ".35em")
      //   .attr("y", function (d) {
      //     return d.children ? -20 : 20;
      //   })
      //   .style("text-anchor", "middle")
      //   .text(function (d) {
      //     return d.data.name;
      //   });
    },
    [width, height, selectedMake]
  );

  return (
    <>
      {makeSelector}
      <div ref={containerRef} className="w-full aspect-square">
        <svg
          ref={ref}
          style={{
            height: height,
            width: width,
            marginRight: "0px",
            marginLeft: "0px",
          }}
        />
      </div>
    </>
  );
}

export default Evolution;
