export function getBaseUrl(request: Request) {
  const { headers } = request;
  const protocol = headers.get("x-forwarded-proto") || "http";
  const host = headers.get("host");
  const baseUrl = `${protocol}://${host}`;
  return baseUrl;
}
