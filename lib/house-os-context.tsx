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
  type: 'food' | 'bar' | 'gym' | 'cinema' | 'spa' | 'rooms'
}

export interface Property {
  id: string
  name: string
  postcode: string
  address: string
  lat: number
  lng: number
  occupancy: number
  revenueToday: number
  fbNet: number
  membersIn: number
  comps: number
  auditStatus: 'closed' | 'review' | 'pending'
  oracleStatus: 'synced' | 'posting' | 'pending' | 'held'
  hasAlert: boolean
  position: { x: number; y: number }
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

// Real UK Soho House locations with accurate coordinates and postcodes
const initialProperties: Property[] = [
  { id: 'farmhouse', name: 'Soho Farmhouse', postcode: 'OX7 4JS', address: 'Great Tew, Chipping Norton', lat: 51.9403, lng: -1.4215, occupancy: 96, revenueToday: 68900, fbNet: 28100, membersIn: 124, comps: 1240, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 36, y: 32 } },
  { id: '180-house', name: '180 House', postcode: 'WC2R 1EA', address: '180 The Strand', lat: 51.5114, lng: -0.1165, occupancy: 88, revenueToday: 42300, fbNet: 18600, membersIn: 298, comps: 890, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 44, y: 58 } },
  { id: 'shoreditch', name: 'Shoreditch House', postcode: 'E1 6AW', address: 'Ebor Street, Shoreditch', lat: 51.5246, lng: -0.0763, occupancy: 91, revenueToday: 38700, fbNet: 15200, membersIn: 187, comps: 720, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 48, y: 62 } },
  { id: 'white-city', name: 'White City House', postcode: 'W12 7FA', address: '101 Wood Lane, Television Centre', lat: 51.5092, lng: -0.2246, occupancy: 78, revenueToday: 31200, fbNet: 12400, membersIn: 156, comps: 340, auditStatus: 'review', oracleStatus: 'held', hasAlert: true, position: { x: 41, y: 64 } },
  { id: 'dean-street', name: '76 Dean Street', postcode: 'W1D 3SQ', address: '76 Dean Street, Soho', lat: 51.5136, lng: -0.1314, occupancy: 84, revenueToday: 28900, fbNet: 14200, membersIn: 203, comps: 560, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 45, y: 60 } },
  { id: 'greek-street', name: 'Soho House (Greek St)', postcode: 'W1D 4EB', address: '40 Greek Street, Soho', lat: 51.5140, lng: -0.1306, occupancy: 82, revenueToday: 24600, fbNet: 9800, membersIn: 142, comps: 420, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 43, y: 55 } },
  { id: 'high-road', name: 'High Road House', postcode: 'W4 1PR', address: '162-170 Chiswick High Road', lat: 51.4927, lng: -0.2633, occupancy: 79, revenueToday: 22100, fbNet: 11300, membersIn: 168, comps: 380, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 50, y: 65 } },
  { id: 'electric', name: 'Electric House', postcode: 'W11 2ED', address: '191 Portobello Road, Notting Hill', lat: 51.5154, lng: -0.2050, occupancy: 86, revenueToday: 18400, fbNet: 8900, membersIn: 89, comps: 290, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 46, y: 59 } },
  { id: 'brighton', name: 'Soho House Brighton', postcode: 'BN1 1UB', address: '29 Ship Street, Brighton', lat: 50.8213, lng: -0.1414, occupancy: 81, revenueToday: 12300, fbNet: 6200, membersIn: 76, comps: 180, auditStatus: 'closed', oracleStatus: 'synced', hasAlert: false, position: { x: 42, y: 67 } },
]

const initialExceptions: Exception[] = [
  { id: 'exc-1', property: 'White City House', title: 'POS Variance Detected', description: 'Bar revenue variance of £340 between POS and payment totals', severity: 'warning', status: 'open' },
  { id: 'exc-2', property: '180 House', title: 'Cinema Sales Variance', description: 'Cinema ticket sales mismatch recurring for 3 days', severity: 'info', status: 'assigned' },
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
  exco: { name: 'Sarah Mitchell', role: 'exco', initials: 'SM' },
  cfo: { name: 'James Chen', role: 'cfo', initials: 'JC' },
  ceo: { name: 'Andrew Carnie', role: 'ceo', initials: 'AC' },
  finance: { name: 'Dave', role: 'finance', initials: 'DV', property: 'white-city' },
  'finance-ops': { name: 'Rachel Thompson', role: 'finance-ops', initials: 'RT' },
  floor: { name: 'James Liu', role: 'floor', initials: 'JL', property: 'white-city' },
  auditor: { name: 'Mark Reynolds', role: 'auditor', initials: 'MR' },
  gm: { name: 'Emma Park', role: 'gm', initials: 'EP', property: 'white-city' },
  'site-manager': { name: 'Tom Williams', role: 'site-manager', initials: 'TW', property: 'shoreditch' },
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
      return '/gm'
    default:
      return '/portfolio'
  }
}
