import { v4 as uuidv4 } from 'uuid'

// Mock data storage
let mockUsers: any[] = [
  {
    id: 'user-1',
    username: 'johndoe',
    password: 'password123',
    email: 'john@example.com',
    mobile: '+1234567890',
    familyName: 'The Doe Family',
    familyKey: 'johndoe',
    token: 'mock-jwt-token-123',
    isGoogleSignIn: false
  }
]

let mockFamilies: any[] = [
  {
    id: 'family-1',
    name: 'The Doe Family',
    familyKey: 'johndoe',
    members: [
      {
        id: 'member-1',
        fullName: 'John Doe',
        nickName: 'Johnny',
        mobile: '+1234567890',
        email: 'john@example.com',
        bio: 'Family patriarch and software engineer',
        gender: 'MALE',
        bloodGroup: 'O+',
        birthDay: '1980-05-15',
        marriageAnniversary: '2005-06-20',
        job: 'Software Engineer',
        education: 'Computer Science Degree',
        familyDoctor: 'Dr. Smith',
        location: 0,
        isActive: true,
        relationships: {
          spouseId: 'member-2',
          childrenIds: ['member-3', 'member-4'],
          parentIds: ['member-5', 'member-6'],
          motherId: 'member-6',
          fatherId: 'member-5'
        }
      },
      {
        id: 'member-2',
        fullName: 'Jane Doe',
        nickName: 'Janie',
        mobile: '+1234567891',
        email: 'jane@example.com',
        bio: 'Loving mother and teacher',
        gender: 'FEMALE',
        bloodGroup: 'A+',
        birthDay: '1982-08-22',
        marriageAnniversary: '2005-06-20',
        job: 'Teacher',
        education: 'Education Degree',
        familyDoctor: 'Dr. Smith',
        location: 1,
        isActive: true,
        relationships: {
          spouseId: 'member-1',
          childrenIds: ['member-3', 'member-4'],
          parentIds: ['member-7', 'member-8'],
          motherId: 'member-8',
          fatherId: 'member-7'
        }
      },
      {
        id: 'member-3',
        fullName: 'Alice Doe',
        nickName: 'Ally',
        mobile: '+1234567892',
        email: 'alice@example.com',
        bio: 'Bright student with a love for science',
        gender: 'FEMALE',
        bloodGroup: 'O+',
        birthDay: '2008-03-10',
        job: 'Student',
        education: 'High School',
        location: 2,
        isActive: true,
        relationships: {
          parentIds: ['member-1', 'member-2'],
          motherId: 'member-2',
          fatherId: 'member-1',
          childrenIds: []
        }
      },
      {
        id: 'member-4',
        fullName: 'Bob Doe',
        nickName: 'Bobby',
        mobile: '+1234567893',
        email: 'bob@example.com',
        bio: 'Energetic kid who loves sports',
        gender: 'MALE',
        bloodGroup: 'A+',
        birthDay: '2010-11-05',
        job: 'Student',
        education: 'Middle School',
        location: 3,
        isActive: true,
        relationships: {
          parentIds: ['member-1', 'member-2'],
          motherId: 'member-2',
          fatherId: 'member-1',
          childrenIds: []
        }
      },
      {
        id: 'member-5',
        fullName: 'Robert Doe Sr.',
        nickName: 'Bob Sr.',
        mobile: '+1234567894',
        email: 'robert.sr@example.com',
        bio: 'Retired engineer and grandfather',
        gender: 'MALE',
        bloodGroup: 'O+',
        birthDay: '1955-12-01',
        marriageAnniversary: '1978-04-15',
        job: 'Retired Engineer',
        education: 'Engineering Degree',
        familyDoctor: 'Dr. Johnson',
        location: 4,
        isActive: true,
        relationships: {
          spouseId: 'member-6',
          childrenIds: ['member-1'],
          parentIds: [],
          childrenIds: ['member-1']
        }
      },
      {
        id: 'member-6',
        fullName: 'Mary Doe',
        nickName: 'Grandma Mary',
        mobile: '+1234567895',
        email: 'mary@example.com',
        bio: 'Loving grandmother who makes the best cookies',
        gender: 'FEMALE',
        bloodGroup: 'A-',
        birthDay: '1958-07-18',
        marriageAnniversary: '1978-04-15',
        job: 'Retired Nurse',
        education: 'Nursing Degree',
        familyDoctor: 'Dr. Johnson',
        location: 5,
        isActive: true,
        relationships: {
          spouseId: 'member-5',
          childrenIds: ['member-1'],
          parentIds: [],
          childrenIds: ['member-1']
        }
      },
      {
        id: 'member-7',
        fullName: 'William Smith',
        nickName: 'Bill',
        mobile: '+1234567896',
        email: 'bill@example.com',
        bio: 'Retired businessman and grandfather',
        gender: 'MALE',
        bloodGroup: 'B+',
        birthDay: '1952-09-30',
        marriageAnniversary: '1975-05-12',
        job: 'Retired Businessman',
        education: 'Business Degree',
        familyDoctor: 'Dr. Wilson',
        location: 6,
        isActive: true,
        relationships: {
          spouseId: 'member-8',
          childrenIds: ['member-2'],
          parentIds: [],
          childrenIds: ['member-2']
        }
      },
      {
        id: 'member-8',
        fullName: 'Susan Smith',
        nickName: 'Sue',
        mobile: '+1234567897',
        email: 'susan@example.com',
        bio: 'Retired librarian and grandmother',
        gender: 'FEMALE',
        bloodGroup: 'AB+',
        birthDay: '1954-02-14',
        marriageAnniversary: '1975-05-12',
        job: 'Retired Librarian',
        education: 'Library Science Degree',
        familyDoctor: 'Dr. Wilson',
        location: 7,
        isActive: true,
        relationships: {
          spouseId: 'member-7',
          childrenIds: ['member-2'],
          parentIds: [],
          childrenIds: ['member-2']
        }
      }
    ],
    relationships: [
      { id: 'rel-1', fromId: 'member-1', toId: 'member-2', type: 'SPOUSE', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-2', fromId: 'member-2', toId: 'member-1', type: 'SPOUSE', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-3', fromId: 'member-1', toId: 'member-3', type: 'CHILD', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-4', fromId: 'member-1', toId: 'member-4', type: 'CHILD', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-5', fromId: 'member-2', toId: 'member-3', type: 'CHILD', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-6', fromId: 'member-2', toId: 'member-4', type: 'CHILD', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-7', fromId: 'member-5', toId: 'member-1', type: 'CHILD', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-8', fromId: 'member-6', toId: 'member-1', type: 'CHILD', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-9', fromId: 'member-7', toId: 'member-2', type: 'CHILD', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-10', fromId: 'member-8', toId: 'member-2', type: 'CHILD', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-11', fromId: 'member-5', toId: 'member-6', type: 'SPOUSE', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-12', fromId: 'member-6', toId: 'member-5', type: 'SPOUSE', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-13', fromId: 'member-7', toId: 'member-8', type: 'SPOUSE', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'rel-14', fromId: 'member-8', toId: 'member-7', type: 'SPOUSE', createdAt: '2023-01-01T00:00:00Z' }
    ],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
]

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const findUserByUsername = (username: string) => 
  mockUsers.find(user => user.username === username)

const findFamilyByKey = (familyKey: string) => 
  mockFamilies.find(family => family.familyKey === familyKey)

const updateRelationships = (family: any, newMember: any, parentId?: string, relationshipType?: string) => {
  if (!parentId || !relationshipType) return

  const parent = family.members.find((m: any) => m.id === parentId)
  if (!parent) return

  // Initialize relationships if they don't exist
  if (!parent.relationships) {
    parent.relationships = {
      spouseId: undefined,
      childrenIds: [],
      parentIds: [],
      motherId: undefined,
      fatherId: undefined
    }
  }

  switch (relationshipType.toLowerCase()) {
    case 'child':
      // Add child to parent
      if (!parent.relationships.childrenIds.includes(newMember.id)) {
        parent.relationships.childrenIds.push(newMember.id)
      }
      
      // Add parent to child
      if (!newMember.relationships.parentIds.includes(parentId)) {
        newMember.relationships.parentIds.push(parentId)
      }
      
      // Set specific parent reference
      if (parent.gender === 'MALE') {
        newMember.relationships.fatherId = parentId
      } else if (parent.gender === 'FEMALE') {
        newMember.relationships.motherId = parentId
      }
      
      // Add relationship records
      family.relationships.push({
        id: `rel-${Date.now()}-1`,
        fromId: parentId,
        toId: newMember.id,
        type: 'CHILD',
        createdAt: new Date().toISOString()
      })
      break

    case 'spouse':
      // Set spouse relationship (bidirectional)
      parent.relationships.spouseId = newMember.id
      newMember.relationships.spouseId = parentId
      
      // Add relationship records (bidirectional)
      family.relationships.push(
        {
          id: `rel-${Date.now()}-1`,
          fromId: parentId,
          toId: newMember.id,
          type: 'SPOUSE',
          createdAt: new Date().toISOString()
        },
        {
          id: `rel-${Date.now()}-2`,
          fromId: newMember.id,
          toId: parentId,
          type: 'SPOUSE',
          createdAt: new Date().toISOString()
        }
      )
      break

    case 'parent':
    case 'mother':
    case 'father':
      // Add child to new parent
      if (!newMember.relationships.childrenIds.includes(parentId)) {
        newMember.relationships.childrenIds.push(parentId)
      }
      
      // Add parent to existing member
      if (!parent.relationships.parentIds.includes(newMember.id)) {
        parent.relationships.parentIds.push(newMember.id)
      }
      
      // Set specific parent reference
      if (relationshipType === 'mother' || (relationshipType === 'parent' && newMember.gender === 'FEMALE')) {
        parent.relationships.motherId = newMember.id
      } else {
        parent.relationships.fatherId = newMember.id
      }
      
      // Add relationship record
      family.relationships.push({
        id: `rel-${Date.now()}-1`,
        fromId: newMember.id,
        toId: parentId,
        type: relationshipType === 'mother' ? 'MOTHER' : 'FATHER',
        createdAt: new Date().toISOString()
      })
      break
  }
}

// Export individual API modules for easier use
export const mockAuthAPI = {
  register: async (data: any) => {
      await delay(500)
      
      // Check if username exists
      if (findUserByUsername(data.username)) {
        throw new Error('Username already exists')
      }
      
      const newUser = {
        id: uuidv4(),
        username: data.username,
        password: data.password,
        email: data.email,
        mobile: data.mobile,
        familyName: null,
        familyKey: data.username,
        token: `mock-jwt-token-${Date.now()}`,
        isGoogleSignIn: false
      }
      
      mockUsers.push(newUser)
      
      return {
        data: {
          token: newUser.token,
          refreshToken: `refresh-${newUser.token}`,
          username: newUser.username,
          familyName: newUser.familyName,
          familyKey: newUser.familyKey,
          expiresIn: 2592000000
        }
      }
    },

  login: async (data: any) => {
      await delay(500)
      
      const user = findUserByUsername(data.username)
      if (!user || user.password !== data.password) {
        const error = new Error('Invalid credentials')
        throw { response: { data: { message: 'Invalid username or password' } } }
      }
      
      // Update token
      user.token = `mock-jwt-token-${Date.now()}`
      
      return {
        data: {
          token: user.token,
          refreshToken: `refresh-${user.token}`,
          username: user.username,
          familyName: user.familyName,
          familyKey: user.familyKey,
          expiresIn: 2592000000
        }
      }
    },

  googleSignIn: async (token: string) => {
      await delay(500)
      
      const newUser = {
        id: uuidv4(),
        username: `google_${Date.now()}`,
        password: null,
        email: 'google.user@example.com',
        mobile: null,
        familyName: null,
        familyKey: `google_${Date.now()}`,
        token: `mock-jwt-token-${Date.now()}`,
        isGoogleSignIn: true
      }
      
      mockUsers.push(newUser)
      
      return {
        data: {
          token: newUser.token,
          refreshToken: `refresh-${newUser.token}`,
          username: newUser.username,
          familyName: newUser.familyName,
          familyKey: newUser.familyKey,
          expiresIn: 2592000000
        }
      }
    },

  logout: async () => {
      await delay(200)
      return { data: {} }
    }
}

export const mockFamilyAPI = {
  createFamily: async (familyName: string) => {
      await delay(500)
      
      const familyKey = `family_${Date.now()}`
      const newFamily = {
        id: uuidv4(),
        name: familyName,
        familyKey,
        members: [],
        relationships: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockFamilies.push(newFamily)
      
      return { data: newFamily }
    },

  getFamily: async (familyKey: string) => {
      await delay(300)
      
      const family = findFamilyByKey(familyKey)
      if (!family) {
        const error = new Error('Family not found')
        throw { response: { data: { message: 'Family not found' } } }
      }
      
      return { data: family }
    },

  addMember: async (familyKey: string, userData: any, parentId?: string, relationshipType?: string) => {
      await delay(500)
      
      const family = findFamilyByKey(familyKey)
      if (!family) {
        const error = new Error('Family not found')
        throw { response: { data: { message: 'Family not found' } } }
      }
      
      const newMember = {
        id: uuidv4(),
        ...userData,
        location: family.members.length,
        isActive: true,
        relationships: {
          spouseId: undefined,
          childrenIds: [],
          parentIds: [],
          motherId: undefined,
          fatherId: undefined
        }
      }
      
      // Update relationships if parent specified
      if (parentId && relationshipType) {
        updateRelationships(family, newMember, parentId, relationshipType)
      }
      
      family.members.push(newMember)
      family.updatedAt = new Date().toISOString()
      
      return { data: newMember }
    },

  removeMember: async (familyKey: string, userId: string) => {
      await delay(300)
      
      const family = findFamilyByKey(familyKey)
      if (!family) {
        const error = new Error('Family not found')
        throw { response: { data: { message: 'Family not found' } } }
      }
      
      const memberIndex = family.members.findIndex((m: any) => m.id === userId)
      if (memberIndex === -1) {
        const error = new Error('Member not found')
        throw { response: { data: { message: 'Member not found' } } }
      }
      
      // Mark as inactive instead of removing
      family.members[memberIndex].isActive = false
      
      // Remove relationships
      family.relationships = family.relationships.filter((rel: any) => 
        rel.fromId !== userId && rel.toId !== userId
      )
      
      // Update other members' relationships
      family.members.forEach((member: any) => {
        if (member.id !== userId) {
          member.relationships.childrenIds = member.relationships.childrenIds.filter((id: string) => id !== userId)
          member.relationships.parentIds = member.relationships.parentIds.filter((id: string) => id !== userId)
          if (member.relationships.spouseId === userId) {
            member.relationships.spouseId = undefined
          }
          if (member.relationships.motherId === userId) {
            member.relationships.motherId = undefined
          }
          if (member.relationships.fatherId === userId) {
            member.relationships.fatherId = undefined
          }
        }
      })
      
      family.updatedAt = new Date().toISOString()
      
      return { data: {} }
    },

  updateFamilyName: async (familyKey: string, newName: string) => {
      await delay(300)
      
      const family = findFamilyByKey(familyKey)
      if (!family) {
        const error = new Error('Family not found')
        throw { response: { data: { message: 'Family not found' } } }
      }
      
      family.name = newName
      family.updatedAt = new Date().toISOString()
      
      // Update user's family name
      const user = mockUsers.find(u => u.familyKey === familyKey)
      if (user) {
        user.familyName = newName
      }
      
      return { data: {} }
    }
}

export const mockPublicAPI = {
  getPublicFamily: async (token: string, familyName: string) => {
      await delay(400)
      
      // For mock, just return the first family
      const family = mockFamilies[0]
      if (!family) {
        const error = new Error('Family not found')
        throw { response: { data: { message: 'Family not found' } } }
      }
      
      return { data: family }
    }
}

export const mockImageAPI = {
  uploadImage: async (userId: string, file: File) => {
      await delay(1000)
      
      // Mock image URL
      const imageUrl = `https://mock-storage.com/images/${userId}/${file.name}`
      
      return { data: imageUrl }
    },

  deleteImage: async (imageUrl: string) => {
      await delay(300)
      return { data: {} }
    }
}
