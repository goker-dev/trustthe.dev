import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert' // Adjust path if needed
import { Button } from '@/components/ui/button' // Adjust path if needed
import { cn } from '@/lib/utils' // Adjust path if needed
import * as React from 'react'

// Option 1: Use a generic icon from lucide-react (already installed with shadcn)
import { ExternalLink, MessageSquare } from 'lucide-react'

// Option 2: Or import a specific Discord icon if you installed react-icons
// import { FaDiscord } from 'react-icons/fa'; // Example using react-icons

interface Props {
  /** The specific identifier for the artwork, e.g., "0-8". Used in the title. */
  artworkCoordinates?: string // e.g., "[0,8]" derived from artworkId like "0-8"
  /** The full URL to your Discord channel/invite link */
  discordChannelUrl: string
  /** Optional additional classes for the Alert container */
  className?: string
  /** Whether to show the detailed description */
  detailed?: boolean
}

export const DiscordCta: React.FC<Props> = ({
  artworkCoordinates,
  discordChannelUrl,
  className,
  detailed = false,
}) => {
  const titleText = artworkCoordinates
    ? `Discuss Echoneo Artwork ${artworkCoordinates}`
    : 'Join the Echoneo Discussion'

  const descriptionText = `Share your thoughts, interpretations, and questions about this artwork with the Echoneo community. Let's explore the echoes together!`

  return detailed ? (
    <Alert
      className={cn('border-primary/50 bg-primary/5 mt-8 mb-6', className)}
    >
      <AlertTitle className="flex items-center gap-2 text-lg font-semibold">
        <a href={discordChannelUrl} target="_blank" rel="noopener noreferrer">
          {titleText}
        </a>
        <MessageSquare className="text-primary h-5 w-5" />
      </AlertTitle>
      <AlertDescription className="mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-muted-foreground flex-grow">
          <a href={discordChannelUrl} target="_blank" rel="noopener noreferrer">
            {descriptionText}
          </a>
        </p>
      </AlertDescription>
    </Alert>
  ) : (
    <Button
      asChild
      size="sm"
      className="bg-primary hover:bg-primary/90 text-primary-foreground mt-3 shrink-0 sm:mt-0"
    >
      {/* Use target="_blank" for external link to open in new tab */}
      <a href={discordChannelUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="mr-2 h-4 w-4" /> {/* Indicate external link */}
        Discuss on Discord
      </a>
    </Button>
  )
}

DiscordCta.displayName = 'DiscordCta'
