// src/components/documentation/documentation-editor.tsx
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "./editor-toolbar";

interface DocumentData {
    id: string;
    title: string;
    content: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

async function fetchDocument(projectId: string): Promise<DocumentData> {
    const res = await fetch(`/api/projects/${projectId}/documentation`);
    if (!res.ok) throw new Error("Failed to fetch documentation");
    const data = await res.json();
    return data.document;
}

async function updateDocument({
    projectId,
    title,
    content,
}: {
    projectId: string;
    title: string;
    content: string;
}): Promise<DocumentData> {
    const res = await fetch(`/api/projects/${projectId}/documentation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error("Failed to update documentation");
    const data = await res.json();
    return data.document;
}

export default function ProjectDocumentationEditor({
    projectId,
}: {
    projectId: string;
}) {
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);

    // Fetch the project's documentation using React Query.
    const {
        data: document,
        isLoading,
        error,
    } = useQuery<DocumentData>({
        queryKey: ["documentation", projectId],
        queryFn: () => fetchDocument(projectId),
    });

    // Set up a mutation for updating (autosaving) the documentation.
    const mutation = useMutation({
        mutationFn: updateDocument,
        onMutate: () => setIsSaving(true),
        onSuccess: (updatedDoc) => {
            // Update cache if needed, but we don't want to overwrite editor content.
            queryClient.setQueryData(["documentation", projectId], updatedDoc);
            setIsSaving(false);
        },
        onError: () => setIsSaving(false),
    });

    // Initialize the TipTap editor with default content.
    // We'll update the content once with the API data.
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
        ],
        content: "<p>Start writing your documentation here...</p>",
        editorProps: {
            attributes: {
                class: "prose focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            handleAutosave(editor.getHTML());
        },
    });

    // Use a ref to ensure we only set the content from API once (on mount).
    const initialContentLoaded = useRef(false);

    useEffect(() => {
        if (editor && document && !initialContentLoaded.current) {
            editor.commands.setContent(document.content, false);
            initialContentLoaded.current = true;
        }
    }, [editor, document]);

    // Debounce the autosave to avoid excessive API calls.
    const debouncedSave = useCallback(
        debounce((htmlContent: string) => {
            // Always send the latest content as a patch.
            mutation.mutate({
                projectId,
                title: document?.title || "Project Documentation",
                content: htmlContent,
            });
        }, 1000),
        [mutation, projectId, document]
    );

    const handleAutosave = (htmlContent: string) => {
        debouncedSave(htmlContent);
    };

    if (isLoading) return <p>Loading documentation...</p>;
    if (error) return <p>Error loading documentation.</p>;

    return (
        <div className="flex flex-col h-full">
            <EditorToolbar editor={editor} />
            <div className="border rounded-md p-4 flex-grow min-h-[300px]">
                <EditorContent editor={editor} className="h-full" />
            </div>
            <div className="flex justify-end mt-4">
                <Button disabled={isSaving}>
                    {isSaving ? "Saving..." : "Saved"}
                </Button>
            </div>
        </div>
    );
}
