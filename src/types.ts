export type MemberType = 'Founding Member' | 'Invited Guest' | 'Elevate Team' | (string & {})

export interface Member {
  id: string
  name: string
  title: string
  company: string
  location: string
  type: MemberType
  bio: string
  photo: string | null
  companyLogo: string | null
  industry: string
  expertise: string[]
  canHelp: string[]
  links: { linkedin: string | null; whatsapp: string | null }
}

export type SessionType = 'plenary' | 'breakout' | 'experience' | 'meal' | 'logistics'

export interface Group {
  label: string
  venue: string
  locKey: string
  memberIds: string[]
}

export interface Session {
  id: string
  day: string // key into EventConfig.days
  start: string
  end?: string
  title: string
  type: SessionType
  location?: string
  locKey?: string
  desc?: string
  hosts?: string[]
  groupsRef?: string // key into Groups, e.g. "forum" | "dinners" | "workshops" | "experiences"
  groupsTitle?: string // section heading on the session detail, e.g. "The dinners"
}

export interface LocationDef {
  label: string
  x: number
  y: number
}
export type Locations = Record<string, LocationDef>

export interface EventDay {
  key: string
  label: string
  date?: string
}
export interface EventConfig {
  title: string
  dateRange: string
  tagline: string
  venue: string
  days: EventDay[]
}

export type Groups = Record<string, Group[]>

export interface Content {
  event: EventConfig
  members: Member[]
  groups: Groups
  sessions: Session[]
  locations: Locations
}
