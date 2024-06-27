'use client'
export default function ErrorComponent({ error }: { error: Error }) {
    console.error("Error rendering component:", error);
    return (
      <div>
        <h1>Failed to Load the Products</h1>
      </div>
    );
  }
  