async function getHealthData() {
  return Promise.resolve({
    status: "OK",
    message: "Capstone is running successfully",
  });
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <main>
      <h1>Health Check</h1>
      <p>Status: {data.status}</p>
      <p>{data.message}</p>
    </main>
  );
}