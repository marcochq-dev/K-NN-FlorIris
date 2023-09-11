namespace flor_iris_back.model
{
    public class KDTree
    {
        private KDNode BuildTree(List<List<double>> points, int depth)
        {
            if (points.Count == 0)
                return null;

            int k = points[0].Count;
            int axis = depth % k;

            points = points.OrderBy(point => point[axis]).ToList();
            int median = points.Count / 2;

            return new KDNode
            {
                Point = points[median],
                Left = BuildTree(points.GetRange(0, median), depth + 1),
                Right = BuildTree(points.GetRange(median + 1, points.Count - median - 1), depth + 1),
                Axis = axis
            };
        }

        public KDNode Build(List<List<double>> points)
        {
            return BuildTree(points, 0);
        }
    }
}

