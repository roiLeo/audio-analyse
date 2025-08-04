export interface MP3Metadata {
  title?: string
  album?: string
  artist?: string
  year?: number
  genre?: string[]
  trackNumber?: number
  coverImage?: {
    format: string
    data: Uint8Array
    description?: string
    dataUrl?: string
  }
}
