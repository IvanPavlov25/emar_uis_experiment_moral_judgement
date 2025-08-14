/// <reference types="vite/client" />
import Ably from 'ably';

export function subscribeResults(groupId: string, callback: () => void) {
  const key = import.meta.env.VITE_ABLY_API_KEY;
  if (!key) return () => {};
  const ably = new Ably.Realtime(key);
  const channel = ably.channels.get(`group:${groupId}`);
  channel.subscribe('results_ready', callback);
  return () => channel.unsubscribe('results_ready', callback);
}
