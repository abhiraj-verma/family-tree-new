export interface FamilyMember {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate?: string;
  deathDate?: string;
  photo?: string;
  
  // Relationship IDs
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  childrenIds: string[];
  
  // Tree positioning
  x?: number;
  y?: number;
  generation: number;
  
  // UI state
  isExpanded?: boolean;
}

export interface FamilyTreeNode {
  name: string;
  id: string;
  attributes?: {
    gender: string;
    birthDate?: string;
    deathDate?: string;
    photo?: string;
    generation: number;
    memberId: string;
  };
  children?: FamilyTreeNode[];
}

export interface TreeData {
  members: Record<string, FamilyMember>;
  rootId: string;
}

export type RelationshipType = 'father' | 'mother' | 'child' | 'spouse';

export interface AddMemberData {
  name: string;
  gender: 'male' | 'female';
  birthDate?: string;
  deathDate?: string;
  photo?: string;
  relationshipType: RelationshipType;
  relatedToId: string;
}