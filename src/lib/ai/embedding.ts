import { OpenAIApi, Configuration } from "openai-edge";
import { Pinecone } from "@pinecone-database/pinecone";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(titleOfPlaylist: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: titleOfPlaylist,
    });

    const result = await response.json();

    // Verify embedding response structure
    if (!result?.data?.length) {
      throw new Error("No embeddings found in OpenAI API response.");
    }

    return result;
  } catch (error) {
    console.error("Error calling OpenAI embeddings API:", error);
    throw new Error("Failed to generate embeddings. Please try again.");
  }
}

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });
};

export async function loadIntoPinecone(
  embed: number[],
  namespaceName: string,
  titleOfPlaylist: string
) {
  try {
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("ytstats");
    const namespace = pineconeIndex.namespace(namespaceName);

    // Sanitize the vector ID with a hash fallback
    let sanitizedId = titleOfPlaylist
      .replace(/[^a-zA-Z0-9]/g, "-")
      .slice(0, 64); // Truncate to 64 characters

    // if (sanitizedId.length < 5) {
    //   // Use a hash if sanitization results in a very short ID
    //   sanitizedId = crypto.createHash("sha256").update(titleOfPlaylist).digest("hex").slice(0, 64);
    // }

    console.log("Sanitized vector ID:", sanitizedId);

    // Add richer metadata (e.g., timestamp)
    const metadata = {
      title: titleOfPlaylist,
      timestamp: new Date().toISOString(),
    };

    console.log(`Inserting vector into Pinecone [Namespace: ${namespaceName}]`);
    const insertionResult = await namespace.upsert([
      {
        id: sanitizedId,
        values: embed,
        metadata,
      },
    ]);

    console.log("Insertion result:", insertionResult);
    return insertionResult;
  } catch (error) {
    console.error("Error loading embeddings into Pinecone:", error);
    throw new Error("Failed to load embeddings into Pinecone.");
  }
}
