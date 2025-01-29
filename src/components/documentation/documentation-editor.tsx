"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { EditorToolbar } from "./editor-toolbar";

export default function DocumentationEditor() {
    const [isSaving, setIsSaving] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Start writing your documentation here...</p>",
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
            },
        },
    });

    const handleSave = async () => {
        if (!editor) return;
        setIsSaving(true);
        // Simulate API call to save content
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Saved content:", editor.getHTML());
        setIsSaving(false);
    };

    return (
        <>
            <Card className="w-full h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Project Documentation</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                    <EditorToolbar editor={editor} />
                    <div className="border rounded-md p-4 flex-grow min-h-[300px]">
                        <EditorContent editor={editor} className="h-full" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
