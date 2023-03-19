const token = process.env.VUE_APP_API_TOKEN;
const url = process.env.VUE_APP_API_URL;

export const fetchData = async (id?: string) => {
  const fetchURL = id ? [url, id].join("/") : url;

  const res = await fetch(fetchURL, {
    method: "GET",
    headers: new Headers({
      Authorization: "Bearer " + token,
      Accept: "application/json, text/plain, */*",
      "Access-Control-Allow-Origin": "https://wisey.app",
    }),
  });

  return res.json();
};
