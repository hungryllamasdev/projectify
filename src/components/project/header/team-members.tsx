import Image from 'next/image'
import { TeamMember } from './project-header'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface TeamMembersProps {
  members: TeamMember[]
}

export function TeamMembers({ members }: TeamMembersProps) {
  const visibleMembers = members.slice(0, 5)
  const remainingCount = Math.max(0, members.length - 5)

  return (
    <div className="flex -space-x-2">
      {visibleMembers.map((member) => (
        <TooltipProvider key={member.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative h-8 w-8 rounded-full border-2 border-white">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remainingCount} more team members</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

