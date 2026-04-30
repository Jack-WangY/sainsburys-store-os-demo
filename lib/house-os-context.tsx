"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export type UserRole = 'exco' | 'cfo' | 'ceo' | 'finance' | 'finance-ops' | 'floor' | 'auditor' | 'gm' | 'site-manager' | null

export interface User {
  name: string
  role: UserRole
  initials: string
  property?: string
}

export interface Transaction {
  id: string
  time: string
  property: string
  description: string
  amount: number
  type: 'pos' | 'argos' | 'nectar' | 'online' | 'fuel' | 'inventory'
}

// "Property" stays as the type name to keep diffs minimal but represents a Sainsbury's store
export interface Property {
  id: string
  name: string
  postcode: string
  address: string
  lat: number
  lng: number
  occupancy: number       // re-purposed: % of forecast revenue achieved today
  revenueToday: number    // £ today
  fbNet: number           // re-purposed: fresh-food net £
  membersIn: number       // re-purposed: Nectar customers in today
  comps: number           // re-purposed: shrinkage £ today
  auditStatus: 'closed' | 'review' | 'pending'
  oracleStatus: 'synced' | 'posting' | 'pending' | 'held'
  hasAlert: boolean
  position: { x: number; y: number }
  format?: 'superstore' | 'local' | 'central' | 'argos'
}

export interface Exception {
  id: string
  property: string
  title: string
  description: string
  severity: 'warning' | 'error' | 'info'
  status: 'open' | 'assigned' | 'resolved'
}

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'system'
  timestamp: string
}

export interface HouseOSState {
  user: User | null
  isAuthenticated: boolean
  auditProgress: number
  auditExceptions: Exception[]
  transactions: Transaction[]
  properties: Property[]
  oracleStatus: 'synced' | 'posting' | 'held' | 'offline'
  oracleHeldCount: number
  chatMessages: ChatMessage[]
  selectedProperty: string | null
  demoMode: boolean
}

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_AUDIT_PROGRESS'; payload: number }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_ORACLE_STATUS'; payload: 'synced' | 'posting' | 'held' | 'offline' }
  | { type: 'SELECT_PROPERTY'; payload: string | null }
  | { type: 'RESOLVE_EXCEPTION'; payload: string }
  | { type: 'SET_DEMO_MODE'; payload: boolean }

// 9 representative Sainsbury's stores across UK formats — superstores, locals, centrals, and an Argos.
const initialProperties: Property[] = [
  { id: 'potters-bar', name: "Sainsbury's Potters Bar", postcode: 'EN6 1AU', address: '7-8 Darkes Lane, Potters Bar', lat: 51.6948, lng: -0.1856, occupancy: 96, revenueToday: 142800, fbNet: 58200, membersIn: 4124, comps: 1240, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 46, y: 36 }, format: 'superstore' },
  { id: 'nine-elms', name: "Sainsbury's Nine Elms", postcode: 'SW8 5BL', address: '62 Wandsworth Rd, Nine Elms', lat: 51.4842, lng: -0.1245, occupancy: 88, revenueToday: 187300, fbNet: 76600, membersIn: 6298, comps: 2890, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 44, y: 58 }, format: 'superstore' },
  { id: 'kings-cross', name: "Sainsbury's Local King's Cross", postcode: 'N1C 4AB', address: '7-9 Pancras Road, King\'s Cross', lat: 51.5318, lng: -0.1233, occupancy: 91, revenueToday: 38700, fbNet: 15200, membersIn: 1870, comps: 720, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 48, y: 62 }, format: 'local' },
  { id: 'whitechapel', name: "Sainsbury's Whitechapel", postcode: 'E1 7QX', address: '1 Cambridge Heath Road', lat: 51.5180, lng: -0.0633, occupancy: 78, revenueToday: 91200, fbNet: 32400, membersIn: 3156, comps: 3340, auditStatus: 'review', oracleStatus: 'held', hasAlert: true, position: { x: 51, y: 64 }, format: 'superstore' },
  { id: 'cromwell-rd', name: "Sainsbury's Cromwell Road", postcode: 'SW7 4DR', address: '152 Cromwell Road, Kensington', lat: 51.4934, lng: -0.1875, occupancy: 84, revenueToday: 124900, fbNet: 54200, membersIn: 4203, comps: 1560, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 41, y: 60 }, format: 'superstore' },
  { id: 'central-london', name: "Sainsbury's Local Holborn", postcode: 'WC1V 7HX', address: '124-126 High Holborn', lat: 51.5180, lng: -0.1206, occupancy: 82, revenueToday: 24600, fbNet: 9800, membersIn: 1142, comps: 420, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 47, y: 55 }, format: 'central' },
  { id: 'fulham', name: "Sainsbury's Fulham Wharf", postcode: 'SW6 2GA', address: 'Townmead Road, Fulham', lat: 51.4727, lng: -0.1933, occupancy: 79, revenueToday: 102100, fbNet: 41300, membersIn: 3168, comps: 1180, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 39, y: 65 }, format: 'superstore' },
  { id: 'argos-stratford', name: 'Argos Stratford (in-store)', postcode: 'E15 1XE', address: 'Westfield Stratford City', lat: 51.5418, lng: -0.0050, occupancy: 86, revenueToday: 48400, fbNet: 0, membersIn: 1289, comps: 290, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 55, y: 59 }, format: 'argos' },
  { id: 'brighton', name: "Sainsbury's Brighton Marina", postcode: 'BN2 5UT', address: 'Marina Way, Brighton', lat: 50.8129, lng: -0.1014, occupancy: 81, revenueToday: 78300, fbNet: 31200, membersIn: 2376, comps: 980, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 45, y: 76 }, format: 'superstore' },
]

const initialExceptions: Exception[] = [
  { id: 'exc-1', property: "Sainsbury's Whitechapel", title: 'Cash Office Variance', description: 'Cash declared variance of £842 between Tellermate and Z-read totals', severity: 'warning', status: 'open' },
  { id: 'exc-2', property: "Sainsbury's Nine Elms", title: 'Supplier Invoice 3-way Match Fail', description: 'Britvic Inv #BRT-99412 — invoice £18,420 vs PO £17,980 (variance £440 over 3-day SLA)', severity: 'info', status: 'assigned' },
]

const initialState: HouseOSState = {
  user: null,
  isAuthenticated: false,
  auditProgress: 9,
  auditExceptions: initialExceptions,
  transactions: [],
  properties: initialProperties,
  oracleStatus: 'posting',
  oracleHeldCount: 1,
  chatMessages: [],
  selectedProperty: null,
  demoMode: true,
}

function reducer(state: HouseOSState, action: Action): HouseOSState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false }
    case 'SET_AUDIT_PROGRESS':
      return { ...state, auditProgress: action.payload }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions].slice(0, 30) }
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] }
    case 'SET_ORACLE_STATUS':
      return { ...state, oracleStatus: action.payload }
    case 'SELECT_PROPERTY':
      return { ...state, selectedProperty: action.payload }
    case 'RESOLVE_EXCEPTION':
      return {
        ...state,
        auditExceptions: state.auditExceptions.map(e =>
          e.id === action.payload ? { ...e, status: 'resolved' } : e
        ),
      }
    case 'SET_DEMO_MODE':
      return { ...state, demoMode: action.payload }
    default:
      return state
  }
}

const HouseOSContext = createContext<{
  state: HouseOSState
  dispatch: React.Dispatch<Action>
  login: (role: UserRole) => void
  logout: () => void
} | null>(null)

const roleUsers: Record<string, User> = {
  exco: { name: 'Simon Roberts', role: 'exco', initials: 'SR' },
  cfo: { name: 'Bláthnaid Bergin', role: 'cfo', initials: 'BB' },
  ceo: { name: 'Simon Roberts', role: 'ceo', initials: 'SR' },
  finance: { name: 'Priya Shah', role: 'finance', initials: 'PS', property: 'whitechapel' },
  'finance-ops': { name: 'Rachel Thompson', role: 'finance-ops', initials: 'RT' },
  floor: { name: 'James Liu', role: 'floor', initials: 'JL', property: 'whitechapel' },
  auditor: { name: 'Mark Reynolds', role: 'auditor', initials: 'MR' },
  gm: { name: 'Emma Park', role: 'gm', initials: 'EP', property: 'whitechapel' },
  'site-manager': { name: 'Tom Williams', role: 'site-manager', initials: 'TW', property: 'kings-cross' },
}

export function HouseOSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const login = (role: UserRole) => {
    if (role && roleUsers[role]) {
      dispatch({ type: 'LOGIN', payload: roleUsers[role] })
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <HouseOSContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </HouseOSContext.Provider>
  )
}

export function useHouseOS() {
  const context = useContext(HouseOSContext)
  if (!context) {
    throw new Error('useHouseOS must be used within a HouseOSProvider')
  }
  return context
}

export function getRoleDefaultRoute(role: UserRole): string {
  switch (role) {
    case 'exco':
    case 'cfo':
    case 'ceo':
      return '/portfolio'
    case 'finance':
    case 'auditor':
      return '/audit'
    case 'finance-ops':
      return '/finance-ops'
    case 'floor':
      return '/floor'
    case 'gm':
    case 'site-manager':
      return '/portfolio'
    default:
      return '/portfolio'
  }
}
