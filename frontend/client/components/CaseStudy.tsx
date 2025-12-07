import { TrendingDown, Users, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CaseStudy() {
  return (
    <section id="case-study" className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Delhi Case Study
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Protecting India's megacity through predictive air quality modeling
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  The Challenge
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Delhi, one of the world's most populous megacities, faces severe air
                  pollution challenges with gaseous pollutants like NO₂ and O₃ regularly
                  exceeding global safety thresholds. The seasonal variations and rapid
                  urbanization create complex pollution patterns that demand high-resolution,
                  temporally consistent forecasting.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Our Approach
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  By integrating satellite-derived gaseous concentrations with
                  high-resolution meteorological reanalysis data, we developed a robust
                  preprocessing pipeline that ensures spatial alignment and temporal
                  synchronization. This enables accurate 24-hour ahead forecasts of NO₂,
                  CO, and HCHO concentrations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Impact
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our forecasting model delivers validated predictions with standard
                  metrics (RMSE, MAE, Bias) referenced against ground-based measurements,
                  enabling better public health decisions and pollution mitigation strategies.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="border-0 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Location</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Delhi National Capital Region
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Population</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      ~30 million residents
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AQI Improvement</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      24-hour forecasting enables proactive measures
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Forecast Accuracy
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">RMSE</p>
                      <p className="text-lg font-bold text-indigo-600">±8.2 µg/m³</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">MAE</p>
                      <p className="text-lg font-bold text-purple-600">5.1 µg/m³</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
