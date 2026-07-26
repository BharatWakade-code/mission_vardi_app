import React from "react";

interface SchemaScriptProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any>;
}

export default function SchemaScript({ schema }: SchemaScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
