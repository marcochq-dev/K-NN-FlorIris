import React, { ChangeEvent, FormEvent, useState } from "react";
import { TextField, Button, Container, Grid, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { urlClasificar } from "../../services/endpoints";
import Tree from "react-d3-tree";


export default function Clasificar() {

    const [neighbors, setNeighbors] = useState<Array<any>>([]);
    const [nodeInfo, setNodeInfo] = useState(null);

    const [formData, setFormData] = useState({
        sepalLargo: "",
        sepalAncho: "",
        petalLargo: "",
        petalAncho: "",
        K: ""
    });

    const [resultado, setResultado] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const request = {
            NewSample: [
                parseFloat(formData.sepalLargo),
                parseFloat(formData.sepalAncho),
                parseFloat(formData.petalLargo),
                parseFloat(formData.petalAncho)
            ],
            K: parseInt(formData.K, 10)
        };

        axios.post(urlClasificar, request)
            .then((response) => {
                const clasificacion = response.data;
                setResultado(clasificacion.predictedClass);

                if (Array.isArray(clasificacion.neighbors)) {
                    const formattedNeighbors = formatKdTreeNeighbors(clasificacion.neighbors);
                    setNeighbors(formattedNeighbors);
                }
                const formattedData = formatKdTree(clasificacion.node);
                setNodeInfo(formattedData);
                console.log(formattedData);

            })
            .catch((error) => {
                console.error("Error en la clasificación:", error);
            });
    };

    const formatKdTree = (node: KDNode2 | null): any => {
        if (!node) return null;

        console.log("node");


        const formattedNode = {
            name: `Division Axis ${node.axis}-${node.point}`,
            children: [
                formatKdTree(node.left) || {},  // Devuelve un objeto vacío si node.Left es null
                formatKdTree(node.right) || {}, // Devuelve un objeto vacío si node.Right es null
            ],
        };

        return formattedNode;
    };




    const formatKdTreeNeighbors = (neighbors: Array<any> | null): any => {
        if (!neighbors) return null;
        console.log("neighbors");
        console.log(neighbors);
        const formattedNeighbors = neighbors.map((neighbor, index) => ({
            name: `Neighbor ${index} - ${neighbor.item1} - ${neighbor.item2.point}`,
            children: [
                formatKdTree(neighbor.item2.left) || {},
                formatKdTree(neighbor.item2.right) || {},
            ],
        }));

        return {
            name: "Neighbors",
            children: formattedNeighbors,
        };
    };

    return (
        <Container>

            <Card style={{ margin: "20px" }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Clasificador de Iris
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Sepal Largo"
                                    name="sepalLargo"
                                    value={formData.sepalLargo}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Sepal Ancho"
                                    name="sepalAncho"
                                    value={formData.sepalAncho}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Petal Largo"
                                    name="petalLargo"
                                    value={formData.petalLargo}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Petal Ancho"
                                    name="petalAncho"
                                    value={formData.petalAncho}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="K"
                                    name="K"
                                    value={formData.K}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Button variant="contained" color="primary" type="submit" style={{ marginTop: "1rem" }}>
                                Clasificar
                            </Button>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
            {resultado && ( // Mostrar resultado solo si hay un resultado
                <Card style={{ margin: "20px" }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Resultado
                        </Typography>
                        <Typography variant="body1">{resultado}</Typography>
                    </CardContent>
                </Card>
            )}

            {nodeInfo && (
                <Card style={{ margin: "20px" }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Información del Nodo
                        </Typography>


                        <div style={{ width: '1200px', height: '1000px' }}>
                            {nodeInfo !== null && <Tree data={nodeInfo} orientation="vertical" />}
                        </div>
                    </CardContent>
                </Card>
            )}

            {neighbors && (
                <Card style={{ margin: "20px" }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Información de los Vecinos
                        </Typography>

                        <div style={{ width: '1200px', height: '1000px' }}>
                            {neighbors !== null && <Tree data={neighbors} orientation="vertical" />}
                        </div>
                    </CardContent>
                </Card>
            )}

        </Container>
    );
}
