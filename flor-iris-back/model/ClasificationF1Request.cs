namespace flor_iris_back.model
{
    public class ClasificationF1Request
    {
        public List<double> NewSample { get; set; }
        public int K { get; set; }
        public string ActualClass { get; set; } // Agregamos este campo

    }
}