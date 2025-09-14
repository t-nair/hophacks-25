import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);


const ColorClusterChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Run the k-means algorithm
    const k = 3; // Example: 3 clusters
    const clusters = kMeans(colorData, k);

    // Format the data for Chart.js
    const datasets = clusters.map((cluster, index) => {
      const dataPoints = cluster.map(point => ({ x: point[0], y: point[1], z: point[2] }));
      const centroid = clusters.reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1], acc[2] + val[2]]);
      const centroidColor = `rgb(${Math.round(centroid[0] / clusters.length)}, ${Math.round(centroid[1] / clusters.length)}, ${Math.round(centroid[2] / clusters.length)})`;

      return {
        label: `Cluster ${index + 1}`,
        data: dataPoints,
        backgroundColor: centroidColor,
        pointRadius: 8,
        pointHoverRadius: 10,
      };
    });

    setChartData({ datasets });
  }, []);

  const options = {
    scales: {
      x: { title: { display: true, text: 'Red (R)' }, min: 0, max: 255 },
      y: { title: { display: true, text: 'Green (G)' }, min: 0, max: 255 },
    },
    // Note: z-axis (Blue) is not directly visualized in a 2D scatter plot.
    // A 3D graph library would be required for that.
  };

  return <Scatter data={chartData} options={options} />;
};

export default ColorClusterChart;


//try to create the kmeans algorithm here
function kMeans(data, k) {
  // 1. Initialize k centroids randomly
  let centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(data[Math.floor(Math.random() * data.length)]);
  }

  // 2. Loop until convergence
  while (true) {
    // a. Assign each data point to the nearest centroid
    let clusters = Array.from({ length: k }, () => []);
    for (const point of data) {
      const distances = centroids.map(centroid => distance(point, centroid));
      const clusterIndex = distances.indexOf(Math.min(...distances));
      clusters[clusterIndex].push(point);
    }

    // b. Recalculate centroids
    const newCentroids = clusters.map(cluster => {
      if (cluster.length === 0) return [0, 0, 0]; // Avoid division by zero
      const sum = cluster.reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1], acc[2] + val[2]]);
      return [sum[0] / cluster.length, sum[1] / cluster.length, sum[2] / cluster.length];
    });

    // c. Check for convergence (no change in centroids)
    const converged = newCentroids.every((newCentroid, i) =>
      JSON.stringify(newCentroid) === JSON.stringify(centroids[i])
    );
    if (converged) {
      return clusters;
    }

    centroids = newCentroids;
  }
}

// Helper function to calculate Euclidean distance
function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[2] - p1[2], 2));
}

// Your color data as an array of RGB tuples
const colorData = [
  [150, 150, 175], // Confused
  [50, 0, 100],   // Scared
  [200, 50, 50],  // Angry
  [75, 0, 125],   // Sad
  [175, 175, 200], // Weak
  [255, 220, 0],   // Happy
  [220, 80, 50]    // Strong
];





const video = document.getElementById('preview');
    const startBtn = document.getElementById('startRecord');
    const stopBtn = document.getElementById('stopRecord');
    const dashboard = document.getElementById('dashboard');
    const journalDiv = document.getElementById('journalText');
    const recordSection = document.getElementById('record');

    let mediaRecorder;
    let chunks = [];

    // Request camera & mic access
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        video.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = e => chunks.push(e.data);

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const formData = new FormData();
          formData.append('video', blob, 'journal.webm');

          // Upload to Flask
          const response = await fetch('/upload', {
            method: 'POST',
            body: formData
          });
          const data = await response.text();

          // Show dashboard
          recordSection.style.display = "none";
          dashboard.style.display = "flex";
          journalDiv.innerHTML = data;

          // Chart (example, static numbers for now)
          new Chart(document.getElementById('moodChart'), {
            type: 'radar',
            data: {
              labels: ['Happy', 'Calm', 'Focused', 'Stressed', 'Excited'],
              datasets: [{
                label: 'Your Mood',
                data: [65, 80, 70, 40, 90],
                backgroundColor: 'rgba(54,162,235,0.2)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 2
              }]
            }
          });
        };
      });

    // Start 5s recording
    startBtn.onclick = () => {
    chunks = [];
    mediaRecorder.start();
    startBtn.textContent = "Recording...";
    stopBtn.style.display = "inline-block"; // ✅ show stop button
    };

// Stop recording
  stopBtn.onclick = () => {
    mediaRecorder.stop();
    startBtn.textContent = "Start Recording";
    stopBtn.style.display = "none"; // ✅ hide stop button again
  };


//try to create the kmeans algorithm here
function kMeans(data, k) {
  // 1. Initialize k centroids randomly
  let centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(data[Math.floor(Math.random() * data.length)]);
  }

  // 2. Loop until convergence
  while (true) {
    // a. Assign each data point to the nearest centroid
    let clusters = Array.from({ length: k }, () => []);
    for (const point of data) {
      const distances = centroids.map(centroid => distance(point, centroid));
      const clusterIndex = distances.indexOf(Math.min(...distances));
      clusters[clusterIndex].push(point);
    }

    // b. Recalculate centroids
    const newCentroids = clusters.map(cluster => {
      if (cluster.length === 0) return [0, 0, 0]; // Avoid division by zero
      const sum = cluster.reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1], acc[2] + val[2]]);
      return [sum[0] / cluster.length, sum[1] / cluster.length, sum[2] / cluster.length];
    });

    // c. Check for convergence (no change in centroids)
    const converged = newCentroids.every((newCentroid, i) =>
      JSON.stringify(newCentroid) === JSON.stringify(centroids[i])
    );
    if (converged) {
      return clusters;
    }

    centroids = newCentroids;
  }
}

// Helper function to calculate Euclidean distance
function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[2] - p1[2], 2));
}

// Your color data as an array of RGB tuples
const colorData = [
  [150, 150, 175], // Confused
  [50, 0, 100],   // Scared
  [200, 50, 50],  // Angry
  [75, 0, 125],   // Sad
  [175, 175, 200], // Weak
  [255, 220, 0],   // Happy
  [220, 80, 50]    // Strong
];

const ColorClusterChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Run the k-means algorithm
    const k = 3; // Example: 3 clusters
    const clusters = kMeans(colorData, k);

    // Format the data for Chart.js
    const datasets = clusters.map((cluster, index) => {
      const dataPoints = cluster.map(point => ({ x: point[0], y: point[1], z: point[2] }));
      const centroid = clusters.reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1], acc[2] + val[2]]);
      const centroidColor = `rgb(${Math.round(centroid[0] / clusters.length)}, ${Math.round(centroid[1] / clusters.length)}, ${Math.round(centroid[2] / clusters.length)})`;

      return {
        label: `Cluster ${index + 1}`,
        data: dataPoints,
        backgroundColor: centroidColor,
        pointRadius: 8,
        pointHoverRadius: 10,
      };
    });

    setChartData({ datasets });
  }, []);

  const options = {
    scales: {
      x: { title: { display: true, text: 'Red (R)' }, min: 0, max: 255 },
      y: { title: { display: true, text: 'Green (G)' }, min: 0, max: 255 },
    },
    // Note: z-axis (Blue) is not directly visualized in a 2D scatter plot.
    // A 3D graph library would be required for that.
  };

  return <Scatter data={chartData} options={options} />;
};

export default ColorClusterChart;





const video = document.getElementById('preview');
    const startBtn = document.getElementById('startRecord');
    const stopBtn = document.getElementById('stopRecord');
    const dashboard = document.getElementById('dashboard');
    const journalDiv = document.getElementById('journalText');
    const recordSection = document.getElementById('record');

    let mediaRecorder;
    let chunks = [];

    // Request camera & mic access
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        video.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = e => chunks.push(e.data);

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const formData = new FormData();
          formData.append('video', blob, 'journal.webm');

          // Upload to Flask
          const response = await fetch('/upload', {
            method: 'POST',
            body: formData
          });
          const data = await response.text();

          // Show dashboard
          recordSection.style.display = "none";
          dashboard.style.display = "flex";
          journalDiv.innerHTML = data;

          // Chart (example, static numbers for now)
          new Chart(document.getElementById('moodChart'), {
            type: 'radar',
            data: {
              labels: ['Happy', 'Calm', 'Focused', 'Stressed', 'Excited'],
              datasets: [{
                label: 'Your Mood',
                data: [65, 80, 70, 40, 90],
                backgroundColor: 'rgba(54,162,235,0.2)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 2
              }]
            }
          });
        };
      });

    // Start 5s recording
    startBtn.onclick = () => {
    chunks = [];
    mediaRecorder.start();
    startBtn.textContent = "Recording...";
    stopBtn.style.display = "inline-block"; // ✅ show stop button
    };

// Stop recording
  stopBtn.onclick = () => {
    mediaRecorder.stop();
    startBtn.textContent = "Start Recording";
    stopBtn.style.display = "none"; // ✅ hide stop button again
  };
