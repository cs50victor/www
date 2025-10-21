"use client";

import {
  Snippet,
  SnippetCopyButton,
  SnippetHeader,
  SnippetTabsContent,
  SnippetTabsList,
  SnippetTabsTrigger,
} from "@/components/kibo-ui/snippet";
import { useState } from "react";

export type SnippetCommand = {
  label: string;
  // icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
  code: string;
};

export const CodeSnippet = ({
  commands
}: {
  commands: SnippetCommand[];
}) => {
  const [value, setValue] = useState(commands[0].label);
  const activeCommand = commands.find((command) => command.label === value);

  return (
    <Snippet 
      className="bg-gray-area border-none font-mono"
      onValueChange={setValue} 
      value={value}
    >
      <SnippetHeader
        className="bg-gray-area"
      >
        <SnippetTabsList
          className="bg-gray-area"
        >
          {commands.map((command) => (
            <SnippetTabsTrigger 
              className="bg-gray-area! shadow-none! drop-shadow-none! ring-0! border-none! text-xs!"
              key={command.label} 
              value={command.label}
            >
              <span>{command.label}</span>
            </SnippetTabsTrigger>
          ))}
        </SnippetTabsList>
        {activeCommand && (
          <SnippetCopyButton
            onCopy={() =>
              console.log(`Copied "${activeCommand.code}" to clipboard`)
            }
            onError={() =>
              console.error(
                `Failed to copy "${activeCommand.code}" to clipboard`
              )
            }
            value={activeCommand.code}
          />
        )}
      </SnippetHeader>
      {commands.map((command) => (
        <SnippetTabsContent 
          className="bg-gray-area text-foreground font-mono"
          key={command.label} value={command.label}
        >
          {command.code}
        </SnippetTabsContent>
      ))}
    </Snippet>
  );
};
