import { motion } from 'framer-motion';

type Step = 'products' | 'location' | 'delivery' | 'payment';

export function CheckoutSteps({
  currentStep,
  setCurrentStep
}: {
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
}) {
  const steps: Step[] = ['products', 'location', 'delivery', 'payment'];

  return (
    <div className="flex justify-between relative mb-12">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
      {steps.map((step, index) => {
        const isActive = currentStep === step;
        const isCompleted = steps.indexOf(currentStep) > index;

        return (
          <div key={step} className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: isActive || isCompleted ? 1.1 : 1 }}
              onClick={() => isCompleted && setCurrentStep(step)}
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 cursor-pointer ${isActive ? 'bg-green-600 text-white' :
                  isCompleted ? 'bg-green-100 text-green-600' :
                    'bg-white border-2 border-gray-300 text-gray-400'
                }`}
            >
              {index + 1}
            </motion.div>
            <span className={`text-sm font-medium ${isActive ? 'text-green-600' :
                isCompleted ? 'text-green-700' :
                  'text-gray-500'
              }`}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}