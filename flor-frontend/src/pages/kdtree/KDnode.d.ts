interface KDNode {
  Point: number[];
  Left: KDNode | null;
  Right: KDNode | null;
  Axis: number;
}

interface KDTreeData {
  node: KDNode2;
  neighbors: Array<{
    item1: number;
    item2: KDNode2;
  }>;
  predictedClass: string;
}

interface KDNode2 {
  point: number[];
  left: KDNode2 | null;
  right: KDNode2 | null;
  axis: number;
}