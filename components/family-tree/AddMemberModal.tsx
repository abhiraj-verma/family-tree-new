'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus } from 'lucide-react';
import { AddMemberData, RelationshipType } from '@/types/family-tree';

interface AddMemberModalProps {
  relatedToId: string;
  relatedToName: string;
  onAddMember: (data: AddMemberData) => void;
  canAddRelationships: {
    father: boolean;
    mother: boolean;
    spouse: boolean;
    child: boolean;
  };
}

export default function AddMemberModal({ 
  relatedToId, 
  relatedToName, 
  onAddMember, 
  canAddRelationships 
}: AddMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    deathDate: '',
    photo: '',
    relationshipType: 'child' as RelationshipType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }

    const memberData: AddMemberData = {
      ...formData,
      relatedToId,
      birthDate: formData.birthDate || undefined,
      deathDate: formData.deathDate || undefined,
      photo: formData.photo || undefined,
    };

    onAddMember(memberData);
    setIsOpen(false);
    setFormData({
      name: '',
      gender: 'male',
      birthDate: '',
      deathDate: '',
      photo: '',
      relationshipType: 'child',
    });
  };

  const availableRelationships = Object.entries(canAddRelationships)
    .filter(([_, canAdd]) => canAdd)
    .map(([type, _]) => type as RelationshipType);

  if (availableRelationships.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="w-8 h-8 rounded-full p-0 bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Adding a family member related to {relatedToName}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="relationshipType">Relationship</Label>
            <Select
              value={formData.relationshipType}
              onValueChange={(value: RelationshipType) => 
                setFormData(prev => ({ ...prev, relationshipType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {availableRelationships.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Gender *</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value: 'male' | 'female') => 
                setFormData(prev => ({ ...prev, gender: value }))
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deathDate">Death Date</Label>
              <Input
                id="deathDate"
                type="date"
                value={formData.deathDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deathDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              type="url"
              value={formData.photo}
              onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Add Member
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}