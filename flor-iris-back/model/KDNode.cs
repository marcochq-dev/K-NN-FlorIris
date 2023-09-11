namespace flor_iris_back.model
{
    public class KDNode
    {
        public List<double> Point { get; set; }
        public KDNode Left { get; set; }
        public KDNode Right { get; set; }
        public int Axis { get; set; }
    }

}
