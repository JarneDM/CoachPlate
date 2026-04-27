"use client";

import { createStudio } from "@/app/services/studio/createStudio";
import StudioInfo from "@/components/studio/StudioInfo";
import { useRouter } from "next/navigation";
import React from "react";

function StudioPage() {
  const [createdStudio, setCreatedStudio] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const router = useRouter();

  const handleCreateStudio = async () => {
    setErrorMessage(null);
    setIsCreating(true);

    try {
      const result = await createStudio();

      if (result?.error) {
        if (result.error === "Niet ingelogd") {
          router.push("/login");
          return;
        }

        setErrorMessage(result.error);
        return;
      }

      setCreatedStudio(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create studio.";

      setErrorMessage(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <h1>Here comes the ui for studio. with components to pages for user management.</h1>
      <button
        className="rounded-md bg-green-400 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        onClick={handleCreateStudio}
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create Studio"}
      </button>

      {errorMessage && <p className="mt-3 text-sm text-red-600">{errorMessage}</p>}

      {createdStudio && (
        <div>
          <StudioInfo />
        </div>
      )}
    </div>
  );
}

export default StudioPage;
