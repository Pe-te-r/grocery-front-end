// Kenya counties, constituencies, and wards data
export const kenyaCounties = [
  'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu',
  'Taita Taveta', 'Garissa', 'Wajir', 'Mandera',
  // Add all 47 counties
]

export const countyConstituencies: Record<string, string[]> = {
  'Mombasa': ['Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni', 'Mvita'],
  'Nairobi': ['Dagoretti North', 'Dagoretti South', 'Langata', 'Kibra', 'Kasarani', 'Roysambu'],
  // Add all counties with their constituencies
}

export const constituencyWards: Record<string, string[]> = {
  'Changamwe': ['Port Reitz', 'Kipevu', 'Airport', 'Miritini'],
  'Jomvu': ['Jomvu Kuu', 'Mikindani'],
  // Add all constituencies with their wards
}

export const getConstituenciesByCounty = (county: string): string[] => {
  return countyConstituencies[county] || []
}

export const getWardsByConstituency = (constituency: string): string[] => {
  return constituencyWards[constituency] || []
}