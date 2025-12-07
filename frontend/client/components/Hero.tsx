import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 sm:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-100 opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2">
            <TrendingUp className="h-4 w-4 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-700">
              Advanced Air Quality Forecasting
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Predict Air Pollution with{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Precision
            </span>
          </h1>

          <p className="mb-8 text-lg text-gray-600 sm:text-xl leading-relaxed">
            Harness high-resolution meteorological data and satellite imagery to forecast
            gaseous pollutants like NO₂ and O₃. Protect public health in megacities with
            accurate, science-driven predictions.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-base h-12 px-8 border-0">
              Start Forecasting
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="text-base h-12 px-8 border-gray-300 hover:bg-gray-50"
            >
              View Documentation
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">500+</div>
              <p className="mt-2 text-sm text-gray-600">Cities Monitored</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">99.2%</div>
              <p className="mt-2 text-sm text-gray-600">Forecast Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">24h</div>
              <p className="mt-2 text-sm text-gray-600">Ahead Predictions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
