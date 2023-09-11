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
    public class KdTreeController : ControllerBase
    {

        [HttpGet]
        public IActionResult GetKdTree()
        {
            // Construir y entrenar el árbol KD (suponiendo que tengas los datos de entrenamiento)
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

            // Serializar el árbol KD a JSON y enviarlo al cliente
            string jsonTree = JsonConvert.SerializeObject(root);
            return Ok(jsonTree);
        }
    }

}