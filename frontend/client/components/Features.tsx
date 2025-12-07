import { Cloud, Zap, BarChart3, Satellite, Wind, AlertCircle } from "lucide-react";

const features = [
  {
    icon: Satellite,
    title: "Satellite Integration",
    description:
      "Tropospheric NO₂, CO, and HCHO from advanced satellite imagery for precise gas concentration mapping.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Wind,
    title: "Meteorological Data",
    description:
      "High-resolution reanalysis forecast fields integrated with real-time weather patterns and conditions.",
    color: "from-cyan-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Model Evaluation",
    description:
      "Standard metrics (RMSE, MAE, Bias) with reference to ground-based measurements for validation.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cloud,
    title: "Preprocessing Pipeline",
    description:
      "Robust spatial alignment, temporal synchronization, and feature engineering of meteorological variables.",
    color: "from-teal-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description:
      "Instant data processing and forecast generation for rapid response to pollution events.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: AlertCircle,
    title: "Health Alerts",
    description:
      "Automated alerts when pollution thresholds are exceeded, protecting public health and awareness.",
    color: "from-red-500 to-pink-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive Air Quality Intelligence
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Advanced features designed to deliver accurate forecasts and actionable insights
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-gray-200 p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
