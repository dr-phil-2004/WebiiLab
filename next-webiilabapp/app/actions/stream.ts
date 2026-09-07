'use server'

import { StreamClient } from '@stream-io/node-sdk'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!
const apiSecret = process.env.STREAM_KEY!

/**
 * Generates a Stream user token server-side for the given userId.
 * The token embeds the user_id claim so it matches the user passed to connectUser().
 */
export async function generateStreamToken(userId: string): Promise<string> {
    const client = new StreamClient(apiKey, apiSecret)
    // Generate a token valid for 1 hour (default)
    const token = client.generateUserToken({ user_id: userId })
    return token
}
