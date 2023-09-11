
namespace flor_iris_back.model
{
    public class KDNodeDTO
    {
        public KDNode Node { get; set; }
        public List<Tuple<double, KDNode>> Neighbors { get; set; }
        public string PredictedClass  { get; set; }
    }
}