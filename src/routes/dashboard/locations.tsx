import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard/locations')({
  component: LocationManagement,
})

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react'
import { useCountyQuery } from '@/hooks/countyHook'
import { useCreateConstituencies, useGetconstituenciesByCounty } from '@/hooks/constituencyHook'

function LocationManagement() {
  const { data, isLoading: isCountiesLoading } = useCountyQuery()
  const counties = data?.data
  const [selectedCounty, setSelectedCounty] = useState<{
    id: string
    name: string
    code: string
    initials: string
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newConstituenciesInput, setNewConstituenciesInput] = useState('')

  const {
    data: constituenciesData,
    isLoading: isConstituenciesLoading,
    refetch: refetchConstituencies
  } = useGetconstituenciesByCounty(selectedCounty?.name || '')
  const constituencies = constituenciesData?.data

  const [expandedCounty, setExpandedCounty] = useState<string | null>(null)

  const parsedConstituencies = useMemo(() => {
    if (!newConstituenciesInput.trim()) return []

    // Split by either commas or new lines, then trim each item
    return newConstituenciesInput
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
  }, [newConstituenciesInput])

  const handleViewConstituencies = (county: {
    id: string
    county_code: string
    county_name: string
    county_initials: string
  }) => {
    setSelectedCounty({
      id: county.id,
      name: county.county_name,
      code: county.county_code,
      initials: county.county_initials
    })
    setIsModalOpen(true)
  }
  const constituenciesMutate = useCreateConstituencies()
  const handleAddConstituencies = () => {
    if (!selectedCounty || parsedConstituencies.length === 0) return

    // Format the data as requested
    const payload = {
      county_id: selectedCounty.id,
      constituencies: parsedConstituencies
    }
    constituenciesMutate.mutate(payload)

    console.log('Adding constituencies:', payload)

    // Simulate API call
    setTimeout(() => {
      console.log('Constituencies added successfully!')
      setNewConstituenciesInput('')
      refetchConstituencies()
    }, 500)
  }

  const handleDeleteConstituency = (constituencyId: string) => {
    if (!selectedCounty) return

    console.log('Deleting constituency:', {
      county_id: selectedCounty.id,
      constituency_id: constituencyId
    })

    // Simulate API call
    setTimeout(() => {
      console.log('Constituency deleted successfully!')
      refetchConstituencies()
    }, 500)
  }

  const toggleCountyExpansion = (countyId: string) => {
    setExpandedCounty(expandedCounty === countyId ? null : countyId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">Location Management</h1>
          <p className="text-gray-600 mt-2">
            View and manage counties and their constituencies
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-green-700">Counties</h2>
            <p className="text-gray-500 text-sm mt-1">
              {counties?.length || 0} counties available
            </p>
          </div>

          {isCountiesLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {Array.isArray(counties) && counties?.map((county: any) => (
                <li key={county.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {county.county_name}
                      </h3>
                      <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                        <span>Code: {county.county_code}</span>
                        <span>Initials: {county.county_initials}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleCountyExpansion(county.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        aria-label={expandedCounty === county.id ? "Collapse" : "Expand"}
                      >
                        {expandedCounty === county.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleViewConstituencies(county)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Constituencies</span>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedCounty === county.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 pl-4 border-l-2 border-green-200"
                      >
                        <p className="text-sm text-gray-500 mb-2">
                          County ID: {county.id}
                        </p>
                        <button
                          onClick={() => handleViewConstituencies(county)}
                          className="text-sm text-green-600 hover:underline"
                        >
                          Click to manage constituencies →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Constituencies Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCounty && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}  // More blurred background
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-40"  // Increased blur
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-green-700">
                      {selectedCounty.name} Constituencies
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Code: {selectedCounty.code} | Initials: {selectedCounty.initials}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {isConstituenciesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {constituencies?.length > 0 ? (
                        <ul className="space-y-3">
                          {constituencies.map((constituency: any) => (
                            <li
                              key={constituency.id}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="font-medium">{constituency.name}</span>
                              <button
                                onClick={() => handleDeleteConstituency(constituency.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                aria-label="Delete constituency"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No constituencies found for this county
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="p-6 border-t border-gray-200 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="constituencies-input" className="block text-sm font-medium text-gray-700">
                      Add Constituencies (separate by commas or new lines)
                    </label>
                    <textarea
                      id="constituencies-input"
                      value={newConstituenciesInput}
                      onChange={(e) => setNewConstituenciesInput(e.target.value)}
                      placeholder={`Enter constituency names separated by commas or new lines\nExample:\nConstituency 1\nConstituency 2, Constituency 3`}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {parsedConstituencies.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Constituencies to be added ({parsedConstituencies.length}):
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {parsedConstituencies.map((name, index) => (
                          <li key={index} className="flex items-center">
                            <span className="mr-2">•</span>
                            <span>{name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={handleAddConstituencies}
                    disabled={parsedConstituencies.length === 0}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300 flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add {parsedConstituencies.length > 0 ? `${parsedConstituencies.length} Constituencies` : 'Constituencies'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LocationManagement