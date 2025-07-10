import { useState } from "react"

// components/users/AgreementSection.tsx
type AgreementSectionProps = {
  onAgree: (isAgreed: boolean) => void
}

export const AgreementSection = ({ onAgree }: AgreementSectionProps) => {
  const [isAgreed, setIsAgreed] = useState(false)

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const agreed = e.target.checked
    setIsAgreed(agreed)
    onAgree(agreed)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Terms & Conditions</h2>
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50 mb-4">
        <p className="text-sm text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
          Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus
          rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna
          non est bibendum non venenatis nisl tempor.
        </p>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="agreement"
          checked={isAgreed}
          onChange={handleAgreementChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="agreement" className="ml-2 block text-sm text-gray-700">
          I agree to the terms and conditions
        </label>
      </div>
    </div>
  )
}