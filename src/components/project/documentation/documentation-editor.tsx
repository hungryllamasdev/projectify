"use client"

import { useState, useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { EditorToolbar } from "./editor-toolbar"
import type { DocumentData } from "@/utils/types"
import { fetchDocument } from "@/utils/api"
import { useIsMobile } from "@/hooks/use-mobile"

async function updateDocument({
  projectId,
  title,
  content,
}: {
  projectId: string
  title: string
  content: string
}): Promise<DocumentData> {
  const res = await fetch(`/api/projects/${projectId}/documentation`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  })
  if (!res.ok) throw new Error("Failed to update documentation")
  const data = await res.json()
  return data.document
}

export default function ProjectDocumentationEditor({
  projectId,
}: {
  projectId: string
}) {
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useIsMobile()

  const {
    data: document,
    isLoading,
    error,
  } = useQuery<DocumentData>({
    queryKey: ["documentation", projectId],
    queryFn: () => fetchDocument(projectId),
  })

  const mutation = useMutation({
    mutationFn: updateDocument,
    onMutate: () => setIsSaving(true),
    onSuccess: (updatedDoc) => {
      queryClient.setQueryData(["documentation", projectId], updatedDoc)
      setIsSaving(false)
      setUnsavedChanges(false)
    },
    onError: () => setIsSaving(false),
  })

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } })],
    content: "<p>Start writing your documentation here...</p>",
    editorProps: {
      attributes: {
        class: "prose focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setUnsavedChanges(true)
      handleContentChange(editor.getHTML())
    },
  })

  const initialContentLoaded = useRef(false)

  useEffect(() => {
    if (editor && document && !initialContentLoaded.current) {
      editor.commands.setContent(document.content, false)
      initialContentLoaded.current = true
    }
  }, [editor, document])

  // Function to trigger saving after 30 seconds of inactivity
  const handleContentChange = (htmlContent: string) => {
    setUnsavedChanges(true)

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current) // Reset the timer if typing continues
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDocument(htmlContent)
    }, 10000) // Wait 30 seconds after last edit before saving
  }

  // Function to manually save immediately
  const saveDocument = (content?: string) => {
    if (!editor) return

    mutation.mutate({
      projectId,
      title: document?.title || "Project Documentation",
      content: content || editor.getHTML(),
    })

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current) // Clear any scheduled saves
    }
  }

  if (isLoading) return <p>Loading documentation...</p>
  if (error) return <p>Error loading documentation.</p>

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} isMobile={isMobile} />
      <div className={`border rounded-md p-4 flex-grow ${isMobile ? "min-h-[200px]" : "min-h-[300px]"}`}>
        <EditorContent editor={editor} className="h-full" />
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={() => saveDocument()} disabled={isSaving}>
          {isSaving ? "Saving..." : unsavedChanges ? "Save Now" : "Saved"}
        </Button>
      </div>
    </div>
  )
}

