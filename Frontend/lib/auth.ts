export const getCurrentUser = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/user/current", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      method: "GET",
    });
    if (!res.ok) return null;
    const data = await res.json();

    return data.user;
  } catch {
    return null;
  }
};
