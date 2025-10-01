import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

interface ProgressChartProps {
  currentDay: number;
  totalDays: number;
}

export const ProgressChart = ({ currentDay, totalDays }: ProgressChartProps) => {
  const progress = Math.round((currentDay / totalDays) * 100);

  const data = {
    labels: ["Progreso"],
    datasets: [
      {
        label: "Progreso",
        data: [progress],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 8,
        barThickness: 24,
      },
      {
        label: "Restante",
        data: [100 - progress],
        backgroundColor: "rgba(51, 65, 85, 0.3)",
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
        stacked: true,
        max: 100,
      },
      y: {
        display: false,
        stacked: true,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-md"
    >
      <h3 className="text-lg md:text-xl font-semibold mb-4">
        Progreso del Plan (90 Días) -{" "}
        <span className="text-primary font-bold">{progress}%</span>
      </h3>
      <div className="relative h-8">
        <Bar data={data} options={options} />
      </div>
    </motion.section>
  );
};
