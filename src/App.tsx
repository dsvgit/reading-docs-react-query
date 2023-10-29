import { useQuery } from "@tanstack/react-query";
import { pick } from "ramda";

type ResData = {
  name: string;
  description: string;
  subscribers_count: number;
  stargazers_count: number;
  forks_count: number;
};

type ResError = {
  message: string;
  documentation_url: string;
};

export default function App() {
  const { isPending, error, data } = useQuery<ResData, ResError>({
    queryKey: ["repoData"],
    queryFn,
  });

  async function queryFn(): Promise<ResData> {
    const response = await fetch("https://api.github.com/repos/facebook/react");

    if (!response.ok) {
      const error = (await response.json()) as ResError;
      throw error;
    }

    const data = (await response.json()) as ResData;
    return pick(
      [
        "name",
        "description",
        "subscribers_count",
        "stargazers_count",
        "forks_count",
      ],
      data
    );
  }

  if (isPending) {
    return "Loading...";
  }

  if (error) {
    return (
      <div>
        <h1>An error occurred: {error.message}</h1>
        <details>
          <summary>Details</summary>
          Documentation URL: {error.documentation_url}
        </details>
      </div>
    );
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}
