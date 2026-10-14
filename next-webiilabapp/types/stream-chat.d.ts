// Custom data this app attaches to Stream Chat channels and events.
// See https://getstream.io/chat/docs/sdk/react/guides/typescript_and_custom_data_types/
import "stream-chat"

declare module "stream-chat" {
  interface CustomChannelData {
    name?: string
  }

  interface CustomEventTypes {
    // Sent by the host to open the CTA dialog for every attendee.
    open_cta_dialog: "open_cta_dialog"
  }
}
