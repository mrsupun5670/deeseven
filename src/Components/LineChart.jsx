import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = () => {
  const APIURL = import.meta.env.VITE_API_URL || "";

  const [dateRange, setDateRange] = useState("");

  const [state, setState] = useState({
    series: [
      {
        name: "Number of Orders Over Time",
        data: [],
      },
      {
        name: "Customer Growth Trend",
        data: [],
      },
    ],
  });

  const [options, setOptions] = useState({
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#80CAEE", "#FFA07A"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#80CAEE", "#FFA07A"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
    },
  });

  useEffect(() => {
    fetch(`${APIURL}/LoadLineChartData.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.response) {
          const months = data.orders_over_time.map((item) =>
            new Date(item.month).toLocaleString("default", { month: "long" })
          );

          const ordersData = data.orders_over_time.map((item) => item.total_orders);
          const customersData = data.customer_growth.map(
            (item) => item.total_customers
          );

          setState({
            series: [
              {
                name: "Number of Orders Over Time",
                data: ordersData,
              },
              {
                name: "Customer Growth Trend",
                data: customersData,
              },
            ],
          });

          setOptions((prevOptions) => ({
            ...prevOptions,
            xaxis: {
              ...prevOptions.xaxis,
              categories: months,
            },
          }));

          setDateRange(data.date_range);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5 gap-4 p-4 items-end">
            <h4 className="text-xl font-semibold text-black">Total Sales</h4>
            <h3 className="font-medium">{dateRange}</h3>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default LineChart;