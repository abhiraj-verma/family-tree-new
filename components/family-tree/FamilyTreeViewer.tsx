'use client';

import { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { FamilyTreeManager } from '@/lib/family-tree-utils';
import { TreeData, AddMemberData } from '@/types/family-tree';
import TreeNode from './TreeNode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface FamilyTreeViewerProps {
  initialData: TreeData;
  onDataChange: (data: TreeData) => void;
}

export default function FamilyTreeViewer({ initialData, onDataChange }: FamilyTreeViewerProps) {
  const [treeManager, setTreeManager] = useState(new FamilyTreeManager(initialData));
  const [treeData, setTreeData] = useState(treeManager.convertToD3Tree());
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const treeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (treeContainerRef.current) {
      const { width, height } = treeContainerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 4 });
    }
  }, []);

  const handleAddMember = (data: AddMemberData) => {
    try {
      const newMemberId = treeManager.addMember(data);
      const updatedData = treeManager.getData();
      
      setTreeData(treeManager.convertToD3Tree());
      onDataChange(updatedData);
      
      console.log('Added new member:', newMemberId);
    } catch (error) {
      console.error('Error adding member:', error);
      alert(error instanceof Error ? error.message : 'Failed to add member');
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleResetView = () => {
    setZoom(1);
    if (treeContainerRef.current) {
      const { width, height } = treeContainerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 4 });
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(treeManager.getData(), null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'family-tree.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const nodeSize = { x: 200, y: 300 };
  const separation = { siblings: 1.5, nonSiblings: 2 };

  return (
    <div className="w-full h-screen bg-gray-50">
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Family Tree
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="flex items-center gap-1"
              >
                <ZoomIn className="w-4 h-4" />
                Zoom In
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="flex items-center gap-1"
              >
                <ZoomOut className="w-4 h-4" />
                Zoom Out
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetView}
                className="flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={treeContainerRef} className="w-full h-[calc(100vh-120px)] border rounded-lg overflow-hidden">
            <Tree
              data={treeData}
              translate={translate}
              zoom={zoom}
              nodeSize={nodeSize}
              separation={separation}
              orientation="vertical"
              pathFunc="diagonal"
              renderCustomNodeElement={(nodeProps) => (
                <TreeNode
                  nodeData={nodeProps.nodeDatum}
                  treeManager={treeManager}
                  onAddMember={handleAddMember}
                />
              )}
              enableLegacyTransitions
              transitionDuration={300}
              depthFactor={200}
              initialDepth={3}
              collapsible={false}
              zoomable={true}
              draggable={true}
              scaleExtent={{ min: 0.1, max: 3 }}
              translate3d={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}