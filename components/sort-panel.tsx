"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { SortCriterion, SortDirection, SortField } from "@/types/client";
import SortableItem from "./sortable-item";

interface SortPanelProps {
  sortCriteria: SortCriterion[];
  onSortChange: (criteria: SortCriterion[]) => void;
  onClose: () => void;
}

export default function SortPanel({
  sortCriteria,
  onSortChange,
  onClose,
}: SortPanelProps) {
  const [criteria, setCriteria] = useState<SortCriterion[]>(sortCriteria);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    onSortChange(criteria);
  }, [criteria, onSortChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCriteria((items) => {
        const oldIndex = items.findIndex(
          (item) => `${item.field}-${item.id}` === active.id
        );
        const newIndex = items.findIndex(
          (item) => `${item.field}-${item.id}` === over.id
        );
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (id: string) => {
    setCriteria((prev) =>
      prev.filter((item) => `${item.field}-${item.id}` !== id)
    );
  };

  const handleDirectionChange = (id: string, direction: SortDirection) => {
    setCriteria((prev) =>
      prev.map((item) => {
        if (`${item.field}-${item.id}` === id) {
          return { ...item, direction };
        }
        return item;
      })
    );
  };

  const handleAddSort = (field: SortField) => {
    const exists = criteria.some((item) => item.field === field);
    if (exists) return;

    const newCriterion: SortCriterion = {
      field,
      direction: "asc",
      id: Date.now().toString(),
    };

    setCriteria((prev) => [...prev, newCriterion]);
  };

  const handleClearAll = () => {
    setCriteria([]);
  };

  const handleApplySort = () => {
    onSortChange(criteria);
    onClose();
  };

  return (
    <div className="absolute right-0 top-0 z-10 w-[400px] rounded-md border bg-white p-4 shadow-lg animate-in fade-in slide-in-from-top-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Sort By</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={criteria.map(
              (criterion) => `${criterion.field}-${criterion.id}`
            )}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {criteria.map((criterion) => (
                <SortableItem
                  key={`${criterion.id}`}
                  id={`${criterion.field}-${criterion.id}`}
                  criterion={criterion}
                  onRemove={() =>
                    handleRemove(`${criterion.field}-${criterion.id}`)
                  }
                  onDirectionChange={(direction) =>
                    handleDirectionChange(
                      `${criterion.field}-${criterion.id}`,
                      direction
                    )
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {criteria.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No sort criteria added. Add a field below to sort.
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => handleAddSort("name")}
            disabled={criteria.some((c) => c.field === "name")}
          >
            <span className="mr-2">👤</span> Client Name
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => handleAddSort("createdAt")}
            disabled={criteria.some((c) => c.field === "createdAt")}
          >
            <span className="mr-2">📅</span> Created At
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => handleAddSort("updatedAt")}
            disabled={criteria.some((c) => c.field === "updatedAt")}
          >
            <span className="mr-2">🔄</span> Updated At
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => handleAddSort("id")}
            disabled={criteria.some((c) => c.field === "id")}
          >
            <span className="mr-2">🆔</span> Client ID
          </Button>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleClearAll}
            disabled={criteria.length === 0}
          >
            Clear all
          </Button>
          <Button onClick={handleApplySort}>Apply Sort</Button>
        </div>
      </div>
    </div>
  );
}
