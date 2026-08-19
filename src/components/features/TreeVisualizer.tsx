import type { ParseTreeNode, ASTNode } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface TreeNodeProps {
  node: ParseTreeNode | ASTNode;
  depth?: number;
  onSelect?: (node: ParseTreeNode | ASTNode) => void;
  selected?: string;
  isAST?: boolean;
}

function isPTNode(n: ParseTreeNode | ASTNode): n is ParseTreeNode {
  return "symbol" in n;
}

function TreeNodeComp({ node, depth = 0, onSelect, selected, isAST }: TreeNodeProps) {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children.length > 0;
  const isSelected = selected === node.id;
  const isTerminal = isPTNode(node) ? node.isTerminal : node.type === "Literal" || node.type === "Identifier";
  const label = isPTNode(node) ? node.label : (node.value || node.type);

  return (
    <div style={{ paddingLeft: depth * 20 + "px" }}>
      <div
        onClick={() => onSelect?.(node)}
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-all duration-150 group",
          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent",
          depth === 0 && "font-semibold"
        )}
      >
        {hasChildren ? (
          <button
            onClick={e => { e.stopPropagation(); setCollapsed(c => !c); }}
            className={cn("p-0.5 rounded", isSelected ? "hover:bg-primary-foreground/20" : "hover:bg-muted")}
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        ) : <span className="w-5" />}
        <span className={cn(
          "text-sm font-mono",
          isTerminal && !isSelected && "text-amber-600 dark:text-amber-400",
          !isTerminal && !isSelected && depth > 0 && "text-blue-600 dark:text-blue-400",
          depth === 0 && !isSelected && "text-primary"
        )}>
          {label}
        </span>
        {isPTNode(node) && !isTerminal && node.production && !isSelected && (
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            ({node.production})
          </span>
        )}
        {!isPTNode(node) && node.type && label !== node.type && !isSelected && (
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            [{node.type}]
          </span>
        )}
      </div>
      {!collapsed && hasChildren && (
        <div className="border-l border-border ml-3">
          {node.children.map((child) => (
            <TreeNodeComp key={child.id} node={child} depth={depth + 1} onSelect={onSelect} selected={selected} isAST={isAST} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeVisualizerProps {
  tree: ParseTreeNode | ASTNode;
  isAST?: boolean;
  className?: string;
}

export function TreeVisualizer({ tree, isAST, className }: TreeVisualizerProps) {
  const [selected, setSelected] = useState<ParseTreeNode | ASTNode | null>(null);

  const getInfo = (n: ParseTreeNode | ASTNode) => {
    if (isPTNode(n)) {
      return { title: n.label, subtitle: n.isTerminal ? "Terminal symbol" : "Non-terminal", detail: n.production ? `Production: ${n.production}` : "", step: n.step };
    }
    return { title: n.value || n.type, subtitle: `AST Node Type: ${n.type}`, detail: `Children: ${n.children.length}` };
  };

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex-1 rounded-lg border border-border bg-card overflow-auto max-h-96 p-3">
        <TreeNodeComp node={tree} onSelect={n => setSelected(n)} selected={selected?.id} isAST={isAST} />
      </div>
      {selected && (
        <div className="w-56 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm shrink-0">
          {(() => { const info = getInfo(selected); return (
            <>
              <p className="font-semibold text-foreground mb-1 font-mono">{info.title}</p>
              <p className="text-muted-foreground text-xs mb-2">{info.subtitle}</p>
              {info.detail && <p className="text-muted-foreground text-xs mb-2">{info.detail}</p>}
              {"step" in info && info.step !== undefined && <p className="text-muted-foreground text-xs">Parsing step: {info.step}</p>}
              <button onClick={() => setSelected(null)} className="mt-3 text-xs text-muted-foreground hover:text-foreground">Deselect</button>
            </>
          ); })()}
        </div>
      )}
    </div>
  );
}
