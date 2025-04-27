import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { SortCriterion, SortDirection } from "@/types/client";
import { useSortable } from "@dnd-kit/sortable";
import { ArrowDown, ArrowUp, GripVertical, X } from "lucide-react";
import { Button } from "./ui/button";

interface SortItemProps {
  criterion: SortCriterion;
  onRemove: () => void;
  onDirectionChange: (direction: SortDirection) => void;
  id: string;
}

function SortableItem({
  criterion,
  onRemove,
  onDirectionChange,
  id,
}: SortItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getDirectionIcon = () => {
    if (criterion.field === "createdAt" || criterion.field === "updatedAt") {
      return criterion.direction === "asc" ? (
        <>
          <ArrowUp className="h-4 w-4" />
          <span>Newest to Oldest</span>
        </>
      ) : (
        <>
          <ArrowDown className="h-4 w-4" />
          <span>Oldest to Newest</span>
        </>
      );
    }

    return criterion.direction === "asc" ? (
      <>
        <ArrowUp className="h-4 w-4" />
        <span>A-Z</span>
      </>
    ) : (
      <>
        <ArrowDown className="h-4 w-4" />
        <span>Z-A</span>
      </>
    );
  };

  const getFieldIcon = () => {
    switch (criterion.field) {
      case "name":
        return "👤";
      case "id":
        return "🆔";
      case "createdAt":
        return "📅";
      case "updatedAt":
        return "🔄";
      default:
        return "📋";
    }
  };

  const getFieldName = () => {
    switch (criterion.field) {
      case "name":
        return "Client Name";
      case "id":
        return "Client ID";
      case "createdAt":
        return "Created At";
      case "updatedAt":
        return "Updated At";
      default:
        return criterion.field;
    }
  };

  console.log(criterion);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-md border p-2 bg-white",
        isDragging && "opacity-50 border-dashed"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-lg">{getFieldIcon()}</span>
        <span>{getFieldName()}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-xs"
        onClick={() =>
          onDirectionChange(criterion.direction === "asc" ? "desc" : "asc")
        }
      >
        {getDirectionIcon()}
      </Button>
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default SortableItem;
