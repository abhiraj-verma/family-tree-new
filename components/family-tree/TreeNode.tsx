'use client';

import { FamilyMember } from '@/types/family-tree';
import { FamilyTreeManager } from '@/lib/family-tree-utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, Users } from 'lucide-react';
import AddMemberModal from './AddMemberModal';

interface TreeNodeProps {
  nodeData: {
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
  };
  treeManager: FamilyTreeManager;
  onAddMember: (data: any) => void;
}

export default function TreeNode({ nodeData, treeManager, onAddMember }: TreeNodeProps) {
  const { attributes } = nodeData;
  const memberId = attributes?.memberId || nodeData.id;
  const member = treeManager.getMember(memberId);

  if (!member || !attributes) {
    return (
      <div className="flex flex-col items-center">
        <Card className="w-48 border-2 border-dashed border-gray-300">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Unknown Member</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canAddRelationships = {
    father: treeManager.canAddRelationship(memberId, 'father'),
    mother: treeManager.canAddRelationship(memberId, 'mother'),
    spouse: treeManager.canAddRelationship(memberId, 'spouse'),
    child: treeManager.canAddRelationship(memberId, 'child'),
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-center">
      <Card className={`w-48 transition-all duration-200 hover:shadow-lg ${
        member.gender === 'male' 
          ? 'border-blue-200 bg-blue-50' 
          : 'border-pink-200 bg-pink-50'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <User className={`w-4 h-4 ${
                member.gender === 'male' ? 'text-blue-600' : 'text-pink-600'
              }`} />
              <Badge variant="secondary" className="text-xs">
                Gen {member.generation}
              </Badge>
            </div>
            <AddMemberModal
              relatedToId={memberId}
              relatedToName={member.name}
              onAddMember={onAddMember}
              canAddRelationships={canAddRelationships}
            />
          </div>
          
          {member.photo && (
            <div className="mb-3 flex justify-center">
              <img
                src={member.photo}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
            </div>
          )}
          
          <div className="text-center">
            <h3 className="font-semibold text-sm mb-1 text-gray-800">
              {member.name}
            </h3>
            
            {(member.birthDate || member.deathDate) && (
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-2">
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDate(member.birthDate)}
                  {member.deathDate && ` - ${formatDate(member.deathDate)}`}
                </span>
              </div>
            )}
            
            <div className="flex justify-center gap-1 text-xs text-gray-500">
              {member.spouseId && (
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  Married
                </Badge>
              )}
              {member.childrenIds.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {member.childrenIds.length} child{member.childrenIds.length !== 1 ? 'ren' : ''}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}