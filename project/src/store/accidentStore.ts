import { create } from 'zustand';
import axios from 'axios';
import Papa from 'papaparse';
import { mapService, type Hospital } from '../services/maps';

interface AccidentPrediction {
  vehicleType: string;
  speed: number;
  weatherCondition: string;
  roadCondition: string;
  survivalProbability?: number;
}

interface RiskAlert {
  id: string;
  location: [number, number];
  riskLevel: string;
  description: string;
}

interface AccidentData {
  date: string;
  count: number;
}

interface EmergencyRoute {
  hospital: string;
  distance: string;
  duration: string;
  route: string[];
}

interface RiskFactor {
  factor: string;
  risk: number;
  description: string;
  insights: string[];
  recommendations: string[];
  contextualData?: {
    historicalTrend: number;
    recentIncidents: number;
    seasonalImpact: number;
  };
}

interface CurrentAnalysis {
  timestamp: string;
  location: string;
  overallRisk: number;
  contextFactors: {
    timeOfDay: string;
    trafficDensity: string;
    weatherTrend: string;
  };
}

interface AccidentStore {
  loading: boolean;
  routeLoading: boolean;
  riskLoading: boolean;
  prediction: AccidentPrediction | null;
  alerts: RiskAlert[];
  statistics: {
    responseTime: number;
    activeIncidents: number;
    weatherRisk: string;
    roadConditions: string;
  };
  accidentData: AccidentData[];
  emergencyRoute: EmergencyRoute | null;
  riskFactors: RiskFactor[] | null;
  currentAnalysis: CurrentAnalysis | null;
  rawAccidentData: any[];
  setPrediction: (prediction: AccidentPrediction) => void;
  predictSurvival: (data: Omit<AccidentPrediction, 'survivalProbability'>) => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchAccidentData: () => Promise<void>;
  findEmergencyRoute: () => Promise<void>;
  analyzeRiskFactors: () => Promise<void>;
  loadKaggleData: () => Promise<void>;
}

class RiskAnalysisEngine {
  private static instance: RiskAnalysisEngine;
  private historicalData: any[] = [];

  private constructor() {}

  public static getInstance(): RiskAnalysisEngine {
    if (!RiskAnalysisEngine.instance) {
      RiskAnalysisEngine.instance = new RiskAnalysisEngine();
    }
    return RiskAnalysisEngine.instance;
  }

  public setHistoricalData(data: any[]): void {
    this.historicalData = data;
  }

  private calculateTimeBasedRisk(hour: number): number {
    const peakHours = [8, 9, 17, 18];
    const moderateHours = [7, 10, 11, 15, 16, 19];
    
    if (peakHours.includes(hour)) return 75;
    if (moderateHours.includes(hour)) return 50;
    return 25;
  }

  private analyzeWeatherPattern(weatherData: string[], currentWeather: string): {risk: number; insights: string[]} {
    const weatherCounts = weatherData.reduce((acc: Record<string, number>, weather) => {
      acc[weather] = (acc[weather] || 0) + 1;
      return acc;
    }, {});

    const totalCount = weatherData.length;
    const severeWeatherCount = weatherData.filter(w => 
      ['Snow', 'Heavy Rain', 'Fog'].includes(w)
    ).length;

    let risk = (severeWeatherCount / totalCount) * 100;

    // Adjust risk based on current weather
    if (['Snow', 'Fog', 'Rain'].includes(currentWeather)) {
      risk = Math.min(100, risk * 1.5);
    }

    const insights = [
      `${((severeWeatherCount / totalCount) * 100).toFixed(1)}% of accidents occurred in severe weather`,
      `Current weather condition (${currentWeather}) affects risk level`,
      `Most common condition: ${Object.entries(weatherCounts)
        .sort(([,a], [,b]) => b - a)[0][0]}`
    ];

    return { risk, insights };
  }

  private generateContextualRecommendations(
    weather: string,
    roadCondition: string,
    speed: number
  ): string[] {
    const recommendations = [];

    if (weather === 'Snow' || weather === 'Rain') {
      recommendations.push('Reduce speed by 30% in current weather conditions');
      recommendations.push('Maintain greater following distance');
    }

    if (roadCondition === 'Wet' || roadCondition === 'Icy') {
      recommendations.push('Use appropriate tires for conditions');
      recommendations.push('Avoid sudden braking or acceleration');
    }

    if (speed > 80) {
      recommendations.push('Current speed exceeds safe limits for conditions');
      recommendations.push('Consider alternative routes with lower speed limits');
    }

    return recommendations;
  }

  public generateRiskAnalysis(currentData: any): {
    riskFactors: RiskFactor[];
    currentAnalysis: CurrentAnalysis;
  } {
    const currentHour = new Date().getHours();
    const weatherPattern = this.analyzeWeatherPattern(
      this.historicalData.map(d => d.weather_condition),
      currentData.weatherCondition
    );

    const speedRisk = Math.min(100, (currentData.speed / 130) * 100);
    const similarSpeedAccidents = this.historicalData.filter(d => 
      Math.abs(Number(d.speed) - currentData.speed) <= 10
    );
    
    const roadConditionRisk = this.historicalData.filter(d =>
      d.road_condition?.toLowerCase() === currentData.roadCondition.toLowerCase()
    ).length / this.historicalData.length * 100;

    const timeRisk = this.calculateTimeBasedRisk(currentHour);

    const riskFactors: RiskFactor[] = [
      {
        factor: 'Weather Conditions',
        risk: weatherPattern.risk,
        description: `Analysis based on current weather (${currentData.weatherCondition}) and historical patterns`,
        insights: weatherPattern.insights,
        recommendations: this.generateContextualRecommendations(
          currentData.weatherCondition,
          currentData.roadCondition,
          currentData.speed
        ),
        contextualData: {
          historicalTrend: weatherPattern.risk,
          recentIncidents: this.historicalData.slice(-10).length,
          seasonalImpact: timeRisk
        }
      },
      {
        factor: 'Speed Analysis',
        risk: speedRisk,
        description: `Current speed (${currentData.speed} km/h) risk assessment`,
        insights: [
          `${similarSpeedAccidents.length} similar speed accidents in database`,
          `Current speed is ${currentData.speed > 80 ? 'above' : 'within'} safe limits`
        ],
        recommendations: [
          currentData.speed > 80 ? 'Reduce speed immediately' : 'Maintain current speed',
          'Adjust speed based on current conditions',
          'Use cruise control in stable conditions'
        ],
        contextualData: {
          historicalTrend: speedRisk,
          recentIncidents: similarSpeedAccidents.length,
          seasonalImpact: 65
        }
      },
      {
        factor: 'Road Conditions',
        risk: roadConditionRisk,
        description: `Analysis of current road condition (${currentData.roadCondition})`,
        insights: [
          `${roadConditionRisk.toFixed(1)}% of accidents occurred in similar conditions`,
          `Current conditions require ${roadConditionRisk > 50 ? 'increased' : 'normal'} caution`
        ],
        recommendations: [
          currentData.roadCondition === 'Icy' ? 'Use winter tires' : 'Maintain regular tire pressure',
          'Increase following distance in current conditions',
          'Watch for changes in road surface'
        ],
        contextualData: {
          historicalTrend: roadConditionRisk,
          recentIncidents: this.historicalData.filter(d => 
            d.road_condition?.toLowerCase() === currentData.roadCondition.toLowerCase()
          ).length,
          seasonalImpact: 45
        }
      }
    ];

    const overallRisk = (weatherPattern.risk + speedRisk + roadConditionRisk) / 3;

    const currentAnalysis: CurrentAnalysis = {
      timestamp: new Date().toLocaleString(),
      location: currentData.location || 'Current Location',
      overallRisk,
      contextFactors: {
        timeOfDay: currentHour < 12 ? 'Morning' : currentHour < 18 ? 'Afternoon' : 'Evening',
        trafficDensity: timeRisk > 70 ? 'High' : timeRisk > 40 ? 'Moderate' : 'Low',
        weatherTrend: weatherPattern.risk > 70 ? 'Severe' : weatherPattern.risk > 40 ? 'Moderate' : 'Good'
      }
    };

    return { riskFactors, currentAnalysis };
  }
}

const riskEngine = RiskAnalysisEngine.getInstance();

export const useAccidentStore = create<AccidentStore>((set, get) => ({
  loading: false,
  routeLoading: false,
  riskLoading: false,
  prediction: null,
  alerts: [],
  statistics: {
    responseTime: 8.5,
    activeIncidents: 12,
    weatherRisk: 'Moderate',
    roadConditions: 'Good',
  },
  accidentData: [],
  emergencyRoute: null,
  riskFactors: null,
  currentAnalysis: null,
  rawAccidentData: [],
  setPrediction: (prediction) => set({ prediction }),
  loadKaggleData: async () => {
    try {
      const data = await processKaggleData();
      riskEngine.setHistoricalData(data);
      set({ rawAccidentData: data });
    } catch (error) {
      console.error('Error loading Kaggle data:', error);
    }
  },
  predictSurvival: async (data) => {
    set({ loading: true });
    try {
      const { rawAccidentData } = get();
      const survivalProbability = predictSurvivalFromData(data, rawAccidentData);
      
      const { riskFactors, currentAnalysis } = riskEngine.generateRiskAnalysis(data);
      
      set({ 
        prediction: { ...data, survivalProbability },
        riskFactors,
        currentAnalysis,
        loading: false 
      });
    } catch (error) {
      console.error('Error predicting survival:', error);
      set({ loading: false });
    }
  },
  fetchAlerts: async () => {
    try {
      const { rawAccidentData } = get();
      const recentAccidents = rawAccidentData.slice(-10);
      
      const alerts: RiskAlert[] = recentAccidents.map((accident, index) => ({
        id: index.toString(),
        location: [
          parseFloat(accident.latitude || '40.7128'),
          parseFloat(accident.longitude || '-74.0060')
        ],
        riskLevel: accident.severity > 2 ? 'High' : 'Medium',
        description: `${accident.weather_condition || 'Unknown conditions'} - ${accident.road_condition || 'Road condition not specified'}`,
      }));

      set({ alerts });
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  },
  fetchStatistics: async () => {
    try {
      const { rawAccidentData } = get();
      const recentAccidents = rawAccidentData.slice(-100);

      const stats = {
        responseTime: calculateAverageResponseTime(recentAccidents),
        activeIncidents: recentAccidents.length,
        weatherRisk: determineWeatherRisk(recentAccidents),
        roadConditions: determineRoadConditions(recentAccidents),
      };

      set({ statistics: stats });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  },
  fetchAccidentData: async () => {
    try {
      const { rawAccidentData } = get();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toLocaleDateString();
      });

      const accidentData = last7Days.map(date => ({
        date,
        count: rawAccidentData.filter(a => 
          new Date(a.date).toLocaleDateString() === date
        ).length || Math.floor(Math.random() * 10) + 1,
      }));

      set({ accidentData });
    } catch (error) {
      console.error('Error fetching accident data:', error);
    }
  },
  findEmergencyRoute: async () => {
    set({ routeLoading: true });
    try {
      const currentLocation = await mapService.getCurrentPosition();
      const hospitals = await mapService.findNearestHospitals();
      
      if (hospitals.length === 0) {
        throw new Error('No hospitals found nearby');
      }

      const nearestHospital = hospitals[0];
      const route = await mapService.calculateRoute(currentLocation, nearestHospital.location);

      const emergencyRoute: EmergencyRoute = {
        hospital: nearestHospital.name,
        distance: `${route.distance.toFixed(1)} km`,
        duration: `${Math.ceil(route.duration)}`,
        route: route.steps
      };

      set({ emergencyRoute, routeLoading: false });
    } catch (error) {
      console.error('Error finding emergency route:', error);
      set({ emergencyRoute: null, routeLoading: false });
    }
  },
  analyzeRiskFactors: async () => {
    set({ riskLoading: true });
    try {
      const { prediction, rawAccidentData } = get();
      const currentData = prediction || {
        weatherCondition: 'Clear',
        roadCondition: 'Dry',
        speed: 60,
        location: 'Current Location'
      };
      
      const { riskFactors, currentAnalysis } = riskEngine.generateRiskAnalysis(currentData);
      
      set({ 
        riskFactors,
        currentAnalysis,
        riskLoading: false 
      });
    } catch (error) {
      console.error('Error analyzing risk factors:', error);
      set({ riskLoading: false });
    }
  },
}));

const predictSurvivalFromData = (data: Omit<AccidentPrediction, 'survivalProbability'>, accidents: any[]): number => {
  if (!accidents.length) return 50;

  const weights = {
    vehicleType: 0.3,
    speed: 0.3,
    weather: 0.2,
    road: 0.2
  };

  const vehicleTypeMatches = accidents.filter(accident => 
    accident.vehicle_type?.toLowerCase() === data.vehicleType.toLowerCase()
  );
  
  const vehicleTypeProbability = vehicleTypeMatches.length > 0
    ? (vehicleTypeMatches.filter(a => a.survived === '1').length / vehicleTypeMatches.length) * 100
    : 50;

  const speedRisk = (() => {
    const similarSpeeds = accidents.filter(accident => 
      Math.abs(Number(accident.speed) - data.speed) <= 15
    );
    return similarSpeeds.length > 0
      ? (similarSpeeds.filter(a => a.survived === '1').length / similarSpeeds.length) * 100
      : 50;
  })();

  const weatherRisk = (() => {
    const weatherMatches = accidents.filter(accident =>
      accident.weather_condition?.toLowerCase().includes(data.weatherCondition.toLowerCase())
    );
    return weatherMatches.length > 0
      ? (weatherMatches.filter(a => a.survived === '1').length / weatherMatches.length) * 100
      : 50;
  })();

  const roadRisk = (() => {
    const roadMatches = accidents.filter(accident =>
      accident.road_condition?.toLowerCase().includes(data.roadCondition.toLowerCase())
    );
    return roadMatches.length > 0
      ? (roadMatches.filter(a => a.survived === '1').length / roadMatches.length) * 100
      : 50;
  })();

  let survivalProbability = 
    (vehicleTypeProbability * weights.vehicleType) +
    (speedRisk * weights.speed) +
    (weatherRisk * weights.weather) +
    (roadRisk * weights.road);

  if (data.speed > 80) {
    survivalProbability *= 0.8;
  }

  if (data.weatherCondition.toLowerCase() === 'snow' || 
      data.weatherCondition.toLowerCase() === 'fog') {
    survivalProbability *= 0.9;
  }

  if (data.roadCondition.toLowerCase() === 'icy' || 
      data.roadCondition.toLowerCase() === 'under construction') {
    survivalProbability *= 0.85;
  }

  return Math.max(0, Math.min(100, survivalProbability));
};

const calculateAverageResponseTime = (accidents: any[]): number => {
  const times = accidents
    .filter(a => a.response_time)
    .map(a => Number(a.response_time));
  
  if (!times.length) return 8.5;
  return times.reduce((a, b) => a + b, 0) / times.length;
};

const determineWeatherRisk = (accidents: any[]): string => {
  const weatherRisk = accidents.filter(a => 
    a.weather_condition?.toLowerCase().includes('rain') ||
    a.weather_condition?.toLowerCase().includes('snow') ||
    a.weather_condition?.toLowerCase().includes('fog')
  ).length / accidents.length * 100;

  if (weatherRisk > 70) return 'High';
  if (weatherRisk > 40) return 'Moderate';
  return 'Low';
};

const determineRoadConditions = (accidents: any[]): string => {
  const hazardousConditions = accidents.filter(a =>
    a.road_condition?.toLowerCase().includes('wet') ||
    a.road_condition?.toLowerCase().includes('icy') ||
    a.road_condition?.toLowerCase().includes('construction')
  ).length / accidents.length * 100;

  if (hazardousConditions > 70) return 'Poor';
  if (hazardousConditions > 40) return 'Fair';
  return 'Good';
};

const processKaggleData = async () => {
  try {
    const response = await axios.get('/data/road_accident_data.csv');
    const results = Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
    });
    return results.data;
  } catch (error) {
    console.error('Error loading Kaggle data:', error);
    return [];
  }
};