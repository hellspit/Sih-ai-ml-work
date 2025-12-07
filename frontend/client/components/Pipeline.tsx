import { ArrowRight } from "lucide-react";

const stages = [
  {
    number: "01",
    title: "Data Collection",
    description: "Gather high-resolution meteorological and satellite data",
    color: "from-cyan-500 to-blue-500",
  },
  {
    number: "02",
    title: "Preprocessing",
    description: "Spatial alignment and temporal synchronization",
    color: "from-blue-500 to-indigo-500",
  },
  {
    number: "03",
    title: "Feature Engineering",
    description: "Extract key meteorological variables and patterns",
    color: "from-indigo-500 to-purple-500",
  },
  {
    number: "04",
    title: "Model Training",
    description: "Train ML models on historical data and patterns",
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "05",
    title: "Prediction",
    description: "Generate 24-hour ahead forecasts with confidence",
    color: "from-pink-500 to-red-500",
  },
  {
    number: "06",
    title: "Validation",
    description: "Evaluate against RMSE, MAE, and Bias metrics",
    color: "from-red-500 to-orange-500",
  },
];

export default function Pipeline() {
  return (
    <section id="pipeline" className="py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            The Forecasting Pipeline
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A robust end-to-end system for accurate air quality prediction
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center w-full gap-4 mb-4 sm:mb-6">
                <div className={`flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${stage.color} flex-shrink-0`}>
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {stage.number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {stage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {stage.description}
                  </p>
                </div>
              </div>

              {index < stages.length - 1 && (
                <div className="hidden lg:flex flex-col items-center w-full mb-6">
                  <div className="h-8 border-r-2 border-gray-200"></div>
                  <ArrowRight className="h-5 w-5 text-gray-400 transform rotate-90" />
                  <div className="h-8 border-r-2 border-gray-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
