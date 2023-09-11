import axios from "axios";
import { useEffect, useState } from "react";
import { urlKdtree } from "../../services/endpoints";
import Tree from "react-d3-tree";

export default function Kdtree() {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    axios.get(urlKdtree)
      .then((response) => {
        const formattedData = formatKdTree(response.data);
        setTreeData(formattedData);
      })
      .catch((error) => console.error('Error fetching KD tree:', error));

  }, []);

  const formatKdTree = (node: KDNode | null): any => {
    if (!node) return null;
    console.log("node");
        console.log(node);
        console.log(node.Axis);
        console.log(node.Point);

    const formattedNode = {
      name: `Division Axis ${node.Axis} - ${node.Point}`,
      children: [
        formatKdTree(node.Left) || {},  // Devuelve un objeto vacío si node.Left es null
        formatKdTree(node.Right) || {}, // Devuelve un objeto vacío si node.Right es null
      ],
    };
  
    return formattedNode;
  };
  
  
  

  return (
    <div style={{ width: '1500px', height: '1000px' }}>
      {treeData !== null && <Tree data={treeData} orientation="vertical" />}
    </div>
  );
}