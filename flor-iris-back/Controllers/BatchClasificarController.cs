using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using flor_iris_back.model;
using Newtonsoft.Json;

namespace flor_iris_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BatchClasificarController : ControllerBase
    {

        [HttpPost]
        public IActionResult BatchClasificar([FromBody] BatchClasificationRequest request)
        {
            List<(string PredictedClass, string ActualClass)> results = new List<(string PredictedClass, string ActualClass)>();

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

            foreach (var singleRequest in request.Requests)
            {
                List<double> newSample = singleRequest.NewSample;
                int k = singleRequest.K;

                string predictedClass = FindNearestNeighbor(root, newSample, k, trainingData, labels);

                results.Add((predictedClass, singleRequest.ActualClass));
            }

            double f1Score = CalculateF1Score(results);
            string f1ScoreString = double.IsInfinity(f1Score) ? "Infinity" : f1Score.ToString();

            return Ok(new { F1Score = f1ScoreString, Results = results });
        }

        static double CalculateF1Score(List<(string PredictedClass, string ActualClass)> results)
        {
            int truePositives = results.Count(r => r.PredictedClass == r.ActualClass);

            if (truePositives == 0)
            {
                return 0.0; // No hay casos positivos, el F1 Score es 0.
            }

            int falsePositives = results.Count(r => r.PredictedClass != r.ActualClass);
            int falseNegatives = results.Count(r => r.PredictedClass != r.ActualClass);

            double precision = (double)truePositives / (truePositives + falsePositives);
            double recall = (double)truePositives / (truePositives + falseNegatives);

            return 2 * (precision * recall) / (precision + recall);
        }


        static string FindNearestNeighbor(KDNode node, List<double> target, int k, List<List<double>> trainingData, List<string> labels)
        {
            // Inicializa la lista de k vecinos más cercanos
            List<Tuple<double, KDNode>> neighbors = new List<Tuple<double, KDNode>>();

            // Función para calcular la distancia euclidiana entre dos puntos
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

                // Calcula la distancia entre el punto objetivo y el punto del nodo actual
                double distance = CalculateEuclideanDistance(target, currentNode.Point);

                // Actualiza la lista de vecinos si es necesario
                if (neighbors.Count < k || distance < neighbors.Max(t => t.Item1))
                {
                    neighbors.Add(new Tuple<double, KDNode>(distance, currentNode));
                    neighbors = neighbors.OrderBy(t => t.Item1).Take(k).ToList();
                }

                // Decide qué rama del árbol explorar primero
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

                // Explora la rama más cercana primero
                Search(nearerChild);

                // Si es posible que haya vecinos en el otro lado del hiperplano, explora esa rama también
                if (neighbors.Count < k || Math.Abs(target[currentNode.Axis] - currentNode.Point[currentNode.Axis]) < neighbors.Max(t => t.Item1))
                {
                    Search(furtherChild);
                }
            }

            // Comienza la búsqueda desde el nodo raíz
            Search(node);

            // Realiza una votación para determinar la clase
            var classVotes = neighbors.Select(n => labels[trainingData.IndexOf(n.Item2.Point)]).GroupBy(c => c).Select(g => new { Label = g.Key, Count = g.Count() });
            return classVotes.OrderByDescending(v => v.Count).First().Label;
        }

    }


}