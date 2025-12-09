export interface USState {
  code: string;
  name: string;
  region: string;
  coordinates?: [number, number]; // [lng, lat] - only needed for territories that can't be rendered as shapes
}

export const usStates: USState[] = [
  // Northeast
  { code: "CT", name: "Connecticut", region: "Northeast" },
  { code: "ME", name: "Maine", region: "Northeast" },
  { code: "MA", name: "Massachusetts", region: "Northeast" },
  { code: "NH", name: "New Hampshire", region: "Northeast" },
  { code: "NJ", name: "New Jersey", region: "Northeast" },
  { code: "NY", name: "New York", region: "Northeast" },
  { code: "PA", name: "Pennsylvania", region: "Northeast" },
  { code: "RI", name: "Rhode Island", region: "Northeast" },
  { code: "VT", name: "Vermont", region: "Northeast" },

  // Southeast
  { code: "AL", name: "Alabama", region: "Southeast" },
  { code: "AR", name: "Arkansas", region: "Southeast" },
  { code: "DE", name: "Delaware", region: "Southeast" },
  { code: "FL", name: "Florida", region: "Southeast" },
  { code: "GA", name: "Georgia", region: "Southeast" },
  { code: "KY", name: "Kentucky", region: "Southeast" },
  { code: "LA", name: "Louisiana", region: "Southeast" },
  { code: "MD", name: "Maryland", region: "Southeast" },
  { code: "MS", name: "Mississippi", region: "Southeast" },
  { code: "NC", name: "North Carolina", region: "Southeast" },
  { code: "SC", name: "South Carolina", region: "Southeast" },
  { code: "TN", name: "Tennessee", region: "Southeast" },
  { code: "VA", name: "Virginia", region: "Southeast" },
  { code: "WV", name: "West Virginia", region: "Southeast" },
  { code: "DC", name: "Washington D.C.", region: "Southeast" },

  // Midwest
  { code: "IL", name: "Illinois", region: "Midwest" },
  { code: "IN", name: "Indiana", region: "Midwest" },
  { code: "IA", name: "Iowa", region: "Midwest" },
  { code: "KS", name: "Kansas", region: "Midwest" },
  { code: "MI", name: "Michigan", region: "Midwest" },
  { code: "MN", name: "Minnesota", region: "Midwest" },
  { code: "MO", name: "Missouri", region: "Midwest" },
  { code: "NE", name: "Nebraska", region: "Midwest" },
  { code: "ND", name: "North Dakota", region: "Midwest" },
  { code: "OH", name: "Ohio", region: "Midwest" },
  { code: "SD", name: "South Dakota", region: "Midwest" },
  { code: "WI", name: "Wisconsin", region: "Midwest" },

  // Southwest
  { code: "AZ", name: "Arizona", region: "Southwest" },
  { code: "NM", name: "New Mexico", region: "Southwest" },
  { code: "OK", name: "Oklahoma", region: "Southwest" },
  { code: "TX", name: "Texas", region: "Southwest" },

  // West
  { code: "AK", name: "Alaska", region: "West" },
  { code: "CA", name: "California", region: "West" },
  { code: "CO", name: "Colorado", region: "West" },
  { code: "HI", name: "Hawaii", region: "West" },
  { code: "ID", name: "Idaho", region: "West" },
  { code: "MT", name: "Montana", region: "West" },
  { code: "NV", name: "Nevada", region: "West" },
  { code: "OR", name: "Oregon", region: "West" },
  { code: "UT", name: "Utah", region: "West" },
  { code: "WA", name: "Washington", region: "West" },
  { code: "WY", name: "Wyoming", region: "West" },

  // US Territories (rendered as markers since they're not in the Albers USA projection)
  { code: "PR", name: "Puerto Rico", region: "Territories", coordinates: [-66.5901, 18.2208] },
  { code: "VI", name: "U.S. Virgin Islands", region: "Territories", coordinates: [-64.8963, 18.3358] },
  { code: "GU", name: "Guam", region: "Territories", coordinates: [144.7937, 13.4443] },
  { code: "AS", name: "American Samoa", region: "Territories", coordinates: [-170.1322, -14.2710] },
  { code: "MP", name: "Northern Mariana Islands", region: "Territories", coordinates: [145.6739, 15.0979] },
];

export const regions = ["Northeast", "Southeast", "Midwest", "Southwest", "West", "Territories"];

// Helper to get territories (items with coordinates that need to be rendered as markers)
export const getTerritories = () => usStates.filter(s => s.coordinates !== undefined);

export const getStatesByRegion = (region: string) =>
  usStates.filter(s => s.region === region);

export const getTotalStates = () => usStates.length;
