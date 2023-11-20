import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#ffffff',
      }
    },
    title: {
      display: true,
      text: "The World Bank's Education Dataset",
      color: '#ffffff'
    },
  },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
        }
      },
      y: {
        ticks: {
          color: '#ffffff',
        }
      }
    }
};

function Chart( {labels, values}) {

  const data = {
    labels,
    datasets: [
      {
        label: 'Table: International Education',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };
  return (
    <Bar options={options} data={data} />
  );
}

export default Chart;

