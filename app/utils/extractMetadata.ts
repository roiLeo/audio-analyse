import { parseBuffer } from 'music-metadata'
import type { MP3Metadata } from '~/types'

const arrayBufferToBase64 = (buffer: Uint8Array): string => {
  let binary = ''
  const len = buffer.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary)
}

export default async (file: File): Promise<MP3Metadata> => {
  try {
    // Convert File to Uint8Array (browser-compatible)
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Parse metadata from buffer
    const parsedMetadata = await parseBuffer(uint8Array, file.type || 'audio/mpeg')

    // Extract cover image
    let coverImage: MP3Metadata['coverImage'] = undefined
    if (parsedMetadata.common.picture && parsedMetadata.common.picture.length > 0) {
      const picture = parsedMetadata.common.picture[0]

      // Convert Buffer to Uint8Array if needed
      const imageData = picture.data instanceof Uint8Array
        ? picture.data
        : new Uint8Array(picture.data)

      // Create data URL for display
      const base64 = arrayBufferToBase64(imageData)
      const dataUrl = `data:${picture.format};base64,${base64}`

      coverImage = {
        format: picture.format,
        data: imageData,
        description: picture.description,
        dataUrl: dataUrl,
      }
    }

    return {
      title: parsedMetadata.common.title,
      album: parsedMetadata.common.album,
      artist: parsedMetadata.common.artist,
      year: parsedMetadata.common.year,
      genre: parsedMetadata.common.genre,
      trackNumber: parsedMetadata.common.track?.no,
      coverImage,
    }
  }
  catch (error) {
    console.error('Failed to extract metadata:', error)
    throw error
  }
}
