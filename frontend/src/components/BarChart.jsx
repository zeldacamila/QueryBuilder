import '../styles/BarChart.css';

const BarChart = ({ labels, values }) => {
  const maxValue = Math.max(...values);

  return (
    <div>
      <div className="chart-wrap vertical">
        <div className="grid">
          {labels.map((label, index) => {
            const barValue = (values[index] / maxValue) * 100;
            return (
              <div
                className="bar"
                style={{ '--bar-value': `${barValue}%` }}
                data-name={`${label} - ${values[index]}`}
                title={`${label}`}
                key={index}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
