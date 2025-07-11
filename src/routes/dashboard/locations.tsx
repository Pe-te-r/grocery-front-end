import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/locations')({
  component: LocationManagement,
})

import { useState } from 'react'
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
import { useGetconstituenciesByCounty } from '@/hooks/constituencyHook'

function LocationManagement(){
  const { data, isLoading: isCountiesLoading } = useCountyQuery()
  const counties = data?.data
  const [selectedCounty, setSelectedCounty] = useState<{
    id: string
    name: string
    code: string
    initials: string
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newConstituencyName, setNewConstituencyName] = useState('')
  const [expandedCounty, setExpandedCounty] = useState<string | null>(null)

  const {
    data: constituenciesData,
    isLoading: isConstituenciesLoading,
    refetch: refetchConstituencies
  } = useGetconstituenciesByCounty(selectedCounty?.name|| '')
  const constituencies = constituenciesData?.data
  console.log('constituencies', constituencies)

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

  const handleAddConstituency = () => {
    if (!newConstituencyName.trim() || !selectedCounty) return

    // In a real app, you would call an API here
    console.log('Adding constituency:', {
      county_id: selectedCounty.id,
      name: newConstituencyName
    })

    // Simulate API call
    setTimeout(() => {
      console.log('Constituency added successfully!')
      setNewConstituencyName('')
      refetchConstituencies()
    }, 500)
  }

  const handleDeleteConstituency = (constituencyId: string) => {
    if (!selectedCounty) return

    // In a real app, you would call an API here
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
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
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
                      {constituencies?.length> 0 ? (
                        <ul className="space-y-3">
                          {constituencies.map((constituency:any) => (
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

                <div className="p-6 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newConstituencyName}
                      onChange={(e) => setNewConstituencyName(e.target.value)}
                      placeholder="New constituency name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddConstituency}
                      disabled={!newConstituencyName.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300 flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>
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