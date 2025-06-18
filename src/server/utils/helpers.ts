export function getBaseUrl(request: Request) {
  const { headers } = request;
  const protocol = headers.get("x-forwarded-proto") || "http";
  const host = headers.get("host");
  const baseUrl = `${protocol}://${host}`;
  return baseUrl;
}


export function generateSlug(name: string) {
  const symbols = ['~', '@', '%', '$', '&', '*', '!', '^', '+', '=']; // more symbols
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, () => {
      // return a sequence of 1-2 random symbols
      const length = Math.random() < 0.5 ? 1 : 2;
      return Array.from({ length }).map(
        () => symbols[Math.floor(Math.random() * symbols.length)]
      ).join('');
    })
    .replace(/^([~@%\$&*!^+=])+|([~@%\$&*!^+=])+$/g, '') // trim symbols from start and end
    + '-' + Math.random().toString(36).substring(2, 8);
}