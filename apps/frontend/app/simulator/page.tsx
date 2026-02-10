'use client';

import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Step1BasicInfo } from '@/components/simulator/Step1BasicInfo';
import { Step2Results } from '@/components/simulator/Step2Results';
import { Step3Simulation } from '@/components/simulator/Step3Simulation';
import { Step4Final } from '@/components/simulator/Step4Final';
import { useSimulatorStore } from '@/store/simulator.store';

export default function SimulatorPage() {
  const currentStep = useSimulatorStore((s) => s.currentStep);

  return (
    <SimulatorLayout>
      {currentStep === 1 && <Step1BasicInfo />}
      {currentStep === 2 && <Step2Results />}
      {currentStep === 3 && <Step3Simulation />}
      {currentStep === 4 && <Step4Final />}
    </SimulatorLayout>
  );
}
