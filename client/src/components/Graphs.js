import React, { useEffect, useState } from "react";
import { Pie, Line, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { Stack, TextField } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, ArcElement, Tooltip, Legend);

/**
 * Generates graphs to better display the results of the products
 * @returns
 */
function Graphs() {
  const handleSubmission = () => {
    setButton("Fetching");
    const fetchVariety = async () => {
      const res = await fetch("http://localhost:8000/analysis/varietyCount/all/" + searchItem);
      const data = await res.json();
      setPieData({
        labels: data.map((variety) => variety.website),
        datasets: [
          {
            label: "Variety of collections available",
            data: data.map((variety) => variety.count),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      });
      setButton("Fetched");
    };
    const fetchCosts = async () => {
      const res = await fetch("http://localhost:8000/analysis/topCost/all/" + searchItem);
      const data = await res.json();
      setLineData({
        labels: data.map((costs) => costs.website),
        datasets: [
          {
            label: "Lowest price on each website",
            data: data.map((costs) => costs.lowest_price),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ]
          },
          {
            label: "Highest price on each website",
            data: data.map((costs) => costs.highest_price),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ]
          }
        ]
      });
      setButton("Fetched");
    };
   const fetchPriceVsRating = async () => {
  try {
    const res = await fetch(`http://localhost:8000/analysis/priceVsRating/${searchItem}`);
    const data = await res.json();
    
    const websites = [...new Set(data.map(item => item.website))];
    const colors = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)']; // Add more colors if needed

    const datasets = websites.map((website, index) => ({
      label: website.charAt(0).toUpperCase() + website.slice(1), // Capitalize first letter
      data: data
        .filter(item => item.website === website)
        .map(item => ({
          x: parseFloat(item.rating),
          y: parseFloat(item.price.replace('$', '')),
        })),
      backgroundColor: colors[index % colors.length],
    }));

    setScatterData({ datasets });
    setButton("Fetched");
  } catch (error) {
    console.error("Error fetching price vs rating data:", error);
    setButton("Error");
};
    };
    fetchVariety();
    fetchCosts();
    fetchPriceVsRating();
  };

  const [pieData, setPieData] = useState(undefined);
  const [lineData, setLineData] = useState(undefined);
  const [button, setButton] = useState("Default");
  const [searchItem, setSearchItem] = useState(undefined);
  const [scatterData, setScatterData] = useState(undefined);

  return (
    <div>
      <div style={{ display: "flex", marginLeft: "1vw", marginTop: "2vh" }}>
        {button === "Default" ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Search Item"
              variant="outlined"
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <Button size="medium" variant="contained" color="secondary" onClick={handleSubmission}>
              Chart Results
            </Button>
          </Stack>
        ) : button === "Fetching" ? (
          <LoadingButton loading variant="outlined">
            Submit
          </LoadingButton>
        ) : (
          <div></div>
        )}
      </div>
      {pieData != undefined ? (
        <div style={{ display: "flex", width: "60vw", height: "80vh", marginBottom: "15vh", marginTop: "5vh" }}>
          <h2 style={{ margin: "auto", marginLeft: "3vw", marginRight: "3vw", marginBottom: "2vh" }}>
            {" "}
            Variety of {searchItem} available across websites{" "}
          </h2>
          <Pie
            data={pieData}
            options={{
              title: {
                display: true,
                text: "Variety of collections available",
                fontSize: 20
              },
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </div>
      ) : (
        <div></div>
      )}
      {lineData != undefined ? (
        <div style={{ display: "flex", width: "60vw", height: "80vh", marginBottom: "15vh", marginTop: "5vh" }}>
          <h2 style={{ margin: "auto", marginLeft: "3vw", marginRight: "3vw", marginBottom: "2vh" }}>
            {" "}
            Highest and lowest prices of {searchItem} on each website{" "}
          </h2>
          <Line
            data={lineData}
            options={{
              title: {
                display: true,
                text: "Highest and lowest prices on each website",
                fontSize: 20
              },
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </div>
      ) : (
        <div></div>
      )}
      {scatterData != undefined ? (
  <div style={{ display: "flex", width: "60vw", height: "80vh", marginBottom: "15vh", marginTop: "5vh" }}>
    <h2 style={{ margin: "auto", marginLeft: "3vw", marginRight: "3vw", marginBottom: "2vh" }}>
      Price vs Rating for {searchItem} across websites
    </h2>
    <Scatter
      data={scatterData}
      options={{
        scales: {
          x: {
            title: {
              display: true,
              text: 'Rating'
            },
            min: 0,
            max: 5
          },
          y: {
            title: {
              display: true,
              text: 'Price ($)'
            },
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label} - Price: $${context.parsed.y.toFixed(2)}, Rating: ${context.parsed.x.toFixed(1)}`;
              }
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }}
    />
  </div>
) : (
  <div></div>
)}
    </div>
  );
}

export default Graphs;
