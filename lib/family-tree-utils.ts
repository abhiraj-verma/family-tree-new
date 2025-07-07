import { FamilyMember, FamilyTreeNode, TreeData, RelationshipType } from '@/types/family-tree';

export class FamilyTreeManager {
  private data: TreeData;

  constructor(data: TreeData) {
    this.data = data;
  }

  // Get all members
  getAllMembers(): Record<string, FamilyMember> {
    return this.data.members;
  }

  // Get member by ID
  getMember(id: string): FamilyMember | undefined {
    return this.data.members[id];
  }

  // Get root member
  getRootMember(): FamilyMember | undefined {
    return this.data.members[this.data.rootId];
  }

  // Check if adding a relationship is valid
  canAddRelationship(existingMemberId: string, relationshipType: RelationshipType): boolean {
    const existingMember = this.getMember(existingMemberId);
    if (!existingMember) return false;

    switch (relationshipType) {
      case 'father':
        return !existingMember.fatherId;
      case 'mother':
        return !existingMember.motherId;
      case 'spouse':
        return !existingMember.spouseId;
      case 'child':
        return true; // Can always add children
      default:
        return false;
    }
  }

  // Check if member can have ancestors added (blood relatives only)
  canAddAncestors(memberId: string): boolean {
    const member = this.getMember(memberId);
    if (!member) return false;
    
    // Check if this member is blood-related to the root
    return this.isBloodRelated(memberId, this.data.rootId);
  }

  // Check if two members are blood-related
  isBloodRelated(memberId1: string, memberId2: string): boolean {
    const member1 = this.getMember(memberId1);
    const member2 = this.getMember(memberId2);
    
    if (!member1 || !member2) return false;
    if (memberId1 === memberId2) return true;

    // Check if they share common ancestors
    const ancestors1 = this.getAncestors(memberId1);
    const ancestors2 = this.getAncestors(memberId2);
    
    return ancestors1.some(ancestor => ancestors2.includes(ancestor));
  }

  // Get all ancestors of a member
  getAncestors(memberId: string): string[] {
    const ancestors: string[] = [];
    const member = this.getMember(memberId);
    
    if (!member) return ancestors;

    if (member.fatherId) {
      ancestors.push(member.fatherId);
      ancestors.push(...this.getAncestors(member.fatherId));
    }
    
    if (member.motherId) {
      ancestors.push(member.motherId);
      ancestors.push(...this.getAncestors(member.motherId));
    }

    return [...new Set(ancestors)]; // Remove duplicates
  }

  // Get all descendants of a member
  getDescendants(memberId: string): string[] {
    const descendants: string[] = [];
    const member = this.getMember(memberId);
    
    if (!member) return descendants;

    for (const childId of member.childrenIds) {
      descendants.push(childId);
      descendants.push(...this.getDescendants(childId));
    }

    return [...new Set(descendants)]; // Remove duplicates
  }

  // Calculate generation for a member
  calculateGeneration(memberId: string): number {
    const member = this.getMember(memberId);
    if (!member) return 0;

    if (memberId === this.data.rootId) return 0;

    // If has parents, generation is max parent generation + 1
    let maxParentGeneration = -1;
    
    if (member.fatherId) {
      const father = this.getMember(member.fatherId);
      if (father) {
        maxParentGeneration = Math.max(maxParentGeneration, father.generation);
      }
    }
    
    if (member.motherId) {
      const mother = this.getMember(member.motherId);
      if (mother) {
        maxParentGeneration = Math.max(maxParentGeneration, mother.generation);
      }
    }

    return maxParentGeneration >= 0 ? maxParentGeneration + 1 : 0;
  }

  // Add a new member
  addMember(memberData: {
    name: string;
    gender: 'male' | 'female';
    birthDate?: string;
    deathDate?: string;
    photo?: string;
    relationshipType: RelationshipType;
    relatedToId: string;
  }): string {
    const newId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const relatedMember = this.getMember(memberData.relatedToId);
    
    if (!relatedMember) {
      throw new Error('Related member not found');
    }

    if (!this.canAddRelationship(memberData.relatedToId, memberData.relationshipType)) {
      throw new Error(`Cannot add ${memberData.relationshipType} to this member`);
    }

    // Create new member
    const newMember: FamilyMember = {
      id: newId,
      name: memberData.name,
      gender: memberData.gender,
      birthDate: memberData.birthDate,
      deathDate: memberData.deathDate,
      photo: memberData.photo,
      childrenIds: [],
      generation: 0, // Will be calculated
    };

    // Set relationships
    switch (memberData.relationshipType) {
      case 'father':
        newMember.childrenIds = [memberData.relatedToId];
        relatedMember.fatherId = newId;
        break;
      case 'mother':
        newMember.childrenIds = [memberData.relatedToId];
        relatedMember.motherId = newId;
        break;
      case 'child':
        newMember.fatherId = relatedMember.gender === 'male' ? memberData.relatedToId : relatedMember.spouseId;
        newMember.motherId = relatedMember.gender === 'female' ? memberData.relatedToId : relatedMember.spouseId;
        relatedMember.childrenIds.push(newId);
        break;
      case 'spouse':
        newMember.spouseId = memberData.relatedToId;
        relatedMember.spouseId = newId;
        break;
    }

    // Add to data
    this.data.members[newId] = newMember;

    // Recalculate generations for all members
    this.recalculateGenerations();

    return newId;
  }

  // Recalculate generations for all members
  recalculateGenerations(): void {
    // Reset all generations
    Object.values(this.data.members).forEach(member => {
      member.generation = 0;
    });

    // Set root generation
    const rootMember = this.getRootMember();
    if (rootMember) {
      rootMember.generation = 0;
    }

    // Calculate generations in order
    const visited = new Set<string>();
    const queue = [this.data.rootId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const currentMember = this.getMember(currentId);
      if (!currentMember) continue;

      // Update children generations
      for (const childId of currentMember.childrenIds) {
        const child = this.getMember(childId);
        if (child) {
          child.generation = Math.max(child.generation, currentMember.generation + 1);
          queue.push(childId);
        }
      }

      // Update spouse generation (same as current)
      if (currentMember.spouseId) {
        const spouse = this.getMember(currentMember.spouseId);
        if (spouse) {
          spouse.generation = currentMember.generation;
          queue.push(currentMember.spouseId);
        }
      }
    }
  }

  // Convert to D3 tree format
  convertToD3Tree(): FamilyTreeNode {
    const buildNode = (memberId: string, visited = new Set<string>()): FamilyTreeNode => {
      if (visited.has(memberId)) {
        // Return a reference node to avoid infinite loops
        const member = this.getMember(memberId);
        return {
          name: member?.name || 'Unknown',
          id: `ref_${memberId}`,
          attributes: {
            gender: member?.gender || 'male',
            generation: member?.generation || 0,
            memberId: memberId,
          },
        };
      }

      visited.add(memberId);
      const member = this.getMember(memberId);
      
      if (!member) {
        return {
          name: 'Unknown',
          id: memberId,
          attributes: {
            gender: 'male',
            generation: 0,
            memberId: memberId,
          },
        };
      }

      const node: FamilyTreeNode = {
        name: member.name,
        id: memberId,
        attributes: {
          gender: member.gender,
          birthDate: member.birthDate,
          deathDate: member.deathDate,
          photo: member.photo,
          generation: member.generation,
          memberId: memberId,
        },
        children: [],
      };

      // Add spouse as sibling node
      if (member.spouseId && !visited.has(member.spouseId)) {
        const spouse = this.getMember(member.spouseId);
        if (spouse) {
          node.children!.push({
            name: spouse.name,
            id: member.spouseId,
            attributes: {
              gender: spouse.gender,
              birthDate: spouse.birthDate,
              deathDate: spouse.deathDate,
              photo: spouse.photo,
              generation: spouse.generation,
              memberId: member.spouseId,
            },
          });
        }
      }

      // Add children
      for (const childId of member.childrenIds) {
        node.children!.push(buildNode(childId, new Set(visited)));
      }

      return node;
    };

    return buildNode(this.data.rootId);
  }

  // Get data for serialization
  getData(): TreeData {
    return this.data;
  }

  // Update data
  updateData(data: TreeData): void {
    this.data = data;
  }
}