'use client';

import { useState } from 'react';
import { TreeData, FamilyMember } from '@/types/family-tree';
import { FamilyTreeManager } from '@/lib/family-tree-utils';
import FamilyTreeViewer from '@/components/family-tree/FamilyTreeViewer';
import CreateTreeModal from '@/components/family-tree/CreateTreeModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreePine, Users, FileText, Github } from 'lucide-react';

export default function Home() {
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateTree = (rootMemberData: {
    name: string;
    gender: 'male' | 'female';
    birthDate?: string;
    deathDate?: string;
    photo?: string;
  }) => {
    const rootId = `root_${Date.now()}`;
    const rootMember: FamilyMember = {
      id: rootId,
      name: rootMemberData.name,
      gender: rootMemberData.gender,
      birthDate: rootMemberData.birthDate,
      deathDate: rootMemberData.deathDate,
      photo: rootMemberData.photo,
      childrenIds: [],
      generation: 0,
    };

    const newTreeData: TreeData = {
      members: {
        [rootId]: rootMember,
      },
      rootId,
    };

    setTreeData(newTreeData);
  };

  const handleDataChange = (updatedData: TreeData) => {
    setTreeData(updatedData);
  };

  const handleLoadSample = () => {
    const sampleData: TreeData = {
      members: {
        'root_1': {
          id: 'root_1',
          name: 'John Smith',
          gender: 'male',
          birthDate: '1950-03-15',
          childrenIds: ['child_1', 'child_2'],
          generation: 0,
          spouseId: 'spouse_1',
        },
        'spouse_1': {
          id: 'spouse_1',
          name: 'Mary Smith',
          gender: 'female',
          birthDate: '1952-07-22',
          childrenIds: ['child_1', 'child_2'],
          generation: 0,
          spouseId: 'root_1',
        },
        'child_1': {
          id: 'child_1',
          name: 'Alice Smith',
          gender: 'female',
          birthDate: '1975-11-08',
          fatherId: 'root_1',
          motherId: 'spouse_1',
          childrenIds: ['grandchild_1'],
          generation: 1,
        },
        'child_2': {
          id: 'child_2',
          name: 'Bob Smith',
          gender: 'male',
          birthDate: '1978-05-12',
          fatherId: 'root_1',
          motherId: 'spouse_1',
          childrenIds: [],
          generation: 1,
        },
        'grandchild_1': {
          id: 'grandchild_1',
          name: 'Emma Johnson',
          gender: 'female',
          birthDate: '2005-09-30',
          motherId: 'child_1',
          childrenIds: [],
          generation: 2,
        },
      },
      rootId: 'root_1',
    };

    setTreeData(sampleData);
  };

  if (treeData) {
    return (
      <FamilyTreeViewer
        initialData={treeData}
        onDataChange={handleDataChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TreePine className="w-12 h-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-800">Family Tree Builder</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create and visualize your family tree with an intuitive drag-and-drop interface. 
            Add family members, manage relationships, and explore your genealogy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-emerald-200 hover:border-emerald-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="w-5 h-5 text-emerald-600" />
                Create New Tree
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Start building your family tree from scratch. Add the root member and 
                expand your family network by adding parents, children, and spouses.
              </p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Create New Tree
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Try Sample Tree
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Explore the features with a pre-built sample family tree. 
                Perfect for understanding how the relationships work.
              </p>
              <Button 
                onClick={handleLoadSample}
                variant="outline"
                className="w-full border-blue-300 hover:bg-blue-50"
              >
                Load Sample Tree
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Smart Relationships</h3>
                <p className="text-sm text-gray-600">
                  Add parents, children, and spouses with intelligent relationship constraints
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <TreePine className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Visual Tree</h3>
                <p className="text-sm text-gray-600">
                  Interactive tree visualization with zoom, pan, and drag controls
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Export Data</h3>
                <p className="text-sm text-gray-600">
                  Export your family tree data in JSON format for backup or sharing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Github className="w-4 h-4" />
            Built with Next.js, React D3 Tree, and Tailwind CSS
          </p>
        </div>
      </div>

      <CreateTreeModal
        onCreateTree={handleCreateTree}
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}