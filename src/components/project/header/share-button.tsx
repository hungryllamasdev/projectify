'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share } from 'lucide-react'
import { ShareDialog } from './share-dialog'

interface ShareButtonProps {
  documentName?: string
}

export function ShareButton({ documentName }: ShareButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
      <ShareDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        documentName={documentName}
      />
    </>
  )
}

