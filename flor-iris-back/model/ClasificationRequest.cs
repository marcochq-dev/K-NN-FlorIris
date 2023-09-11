namespace flor_iris_back.model
{
    public class ClasificationRequest
    {
        public List<double> NewSample { get; set; }
        public int K { get; set; }
    }
}