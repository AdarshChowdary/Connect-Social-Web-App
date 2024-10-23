import { StreamChat } from "stream-chat";

const streamServerClient = StreamChat.getInstance(
  // By keeping '!', we tell TypeScript that we are sure that these environment variables are defined.
  process.env.STREAMLABS_API_KEY ?? "",
  process.env.STREAMLABS_SECRET ?? "",
);

export default streamServerClient;
