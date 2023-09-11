using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using flor_iris_back.model;

namespace flor_iris_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class MetricsController : ControllerBase
    {
        [HttpPost]
        public IActionResult CalculateF1Score([FromBody] F1ScoreRequest request)
        {
            try
            {
                List<string> actualLabels = request.ActualLabels;
                List<string> predictedLabels = request.PredictedLabels;

                double truePositives = 0;
                double falsePositives = 0;
                double falseNegatives = 0;

                for (int i = 0; i < actualLabels.Count; i++)
                {
                    if (actualLabels[i] == request.PositiveClass && predictedLabels[i] == request.PositiveClass)
                    {
                        truePositives++;
                    }
                    else if (actualLabels[i] != request.PositiveClass && predictedLabels[i] == request.PositiveClass)
                    {
                        falsePositives++;
                    }
                    else if (actualLabels[i] == request.PositiveClass && predictedLabels[i] != request.PositiveClass)
                    {
                        falseNegatives++;
                    }
                }

                double precision = truePositives / (truePositives + falsePositives);
                double recall = truePositives / (truePositives + falseNegatives);

                double f1Score = 2 * (precision * recall) / (precision + recall);

                return Ok(new { F1Score = f1Score });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

public class F1ScoreRequest
{
    public List<string> ActualLabels { get; set; }
    public List<string> PredictedLabels { get; set; }
    public string PositiveClass { get; set; }
}
