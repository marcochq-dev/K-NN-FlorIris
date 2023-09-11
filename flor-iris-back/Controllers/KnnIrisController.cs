using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using flor_iris_back.model;

namespace flor_iris_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KnnIrisController : ControllerBase
    {

        [HttpGet]
        public IActionResult GetIrisData()
        {
            try
            {
                string filePath = Path.Combine(Directory.GetCurrentDirectory(), "model", "iris.data");
                string[] lines = System.IO.File.ReadAllLines(filePath);

                List<object> irisData = new List<object>();

                foreach (var line in lines)
                {
                    string[] parts = line.Split(',');
                    irisData.Add(new
                    {
                        id = Guid.NewGuid(), // Asigna un id único a cada fila
                        sepalLargo = double.Parse(parts[0]),
                        sepalAncho = double.Parse(parts[1]),
                        petalLargo = double.Parse(parts[2]),
                        petalAncho = double.Parse(parts[3]),
                        label = parts[4]
                    });
                }

                return Ok(irisData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost]
        public IActionResult Clasificar([FromBody] ClasificationRequest request)
        {
            List<List<double>> trainingData = new List<List<double>>();
            List<string> labels = new List<string>();

            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "model", "iris.data");
            string[] lines = System.IO.File.ReadAllLines(filePath);

            foreach (var line in lines)
            {
                string[] parts = line.Split(',');

                List<double> features = new List<double>();
                for (int i = 0; i < parts.Length - 1; i++)
                {
                    features.Add(double.Parse(parts[i]));
                }
                trainingData.Add(features);
                labels.Add(parts[parts.Length - 1]);
            }

            KDTree kdTree = new KDTree();
            KDNode root = kdTree.Build(trainingData);

            (KDNode nearestNode, List<Tuple<double, KDNode>> neighbors) = FindNearestNeighbor(root, request.NewSample, request.K, trainingData, labels);
            string predictedClass = GetPredictedClass(neighbors, trainingData, labels);

            KDNodeDTO result = new KDNodeDTO
            {
                Node = nearestNode,
                Neighbors = neighbors,
                PredictedClass = predictedClass
            };
            return Ok(result);
        }
        static string GetPredictedClass(List<Tuple<double, KDNode>> neighbors, List<List<double>> trainingData, List<string> labels)
        {
            var classVotes = neighbors.Select(n => labels[trainingData.IndexOf(n.Item2.Point)]).GroupBy(c => c).Select(g => new { Label = g.Key, Count = g.Count() });
            return classVotes.OrderByDescending(v => v.Count).First().Label;
        }
        static (KDNode nearestNode, List<Tuple<double, KDNode>> neighbors) FindNearestNeighbor(KDNode node, List<double> target, int k, List<List<double>> trainingData, List<string> labels)
        {
            List<Tuple<double, KDNode>> neighbors = new List<Tuple<double, KDNode>>();


            double CalculateEuclideanDistance(List<double> point1, List<double> point2)
            {
                double sum = 0;
                for (int i = 0; i < point1.Count; i++)
                {
                    sum += Math.Pow(point1[i] - point2[i], 2);
                }
                return Math.Sqrt(sum);
            }

            void Search(KDNode currentNode)
            {
                if (currentNode == null)
                    return;

                double distance = CalculateEuclideanDistance(target, currentNode.Point);

                if (neighbors.Count < k || distance < neighbors.Max(t => t.Item1))
                {
                    neighbors.Add(new Tuple<double, KDNode>(distance, currentNode));
                    neighbors = neighbors.OrderBy(t => t.Item1).Take(k).ToList();
                }

                KDNode nearerChild, furtherChild;
                if (target[currentNode.Axis] < currentNode.Point[currentNode.Axis])
                {
                    nearerChild = currentNode.Left;
                    furtherChild = currentNode.Right;
                }
                else
                {
                    nearerChild = currentNode.Right;
                    furtherChild = currentNode.Left;
                }

                Search(nearerChild);

                if (neighbors.Count < k || Math.Abs(target[currentNode.Axis] - currentNode.Point[currentNode.Axis]) < neighbors.Max(t => t.Item1))
                {
                    Search(furtherChild);
                }
            }

            Search(node);

            return (neighbors.FirstOrDefault()?.Item2, neighbors);

        }
    }
}
