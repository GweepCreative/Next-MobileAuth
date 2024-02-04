export async function GET() {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    body: JSON.stringify({
      to: [process.env.EXPONENT_TOKEN],
      title: "İzin gerekli",
      body: "Hesabına giriş tespit ettik. Girişe izin veriyor musunuz?",
      data: {
        random: Math.random(),
        categoryId: `WEBAUTH2`,
      },
      // _category: "WEB_AUTH2",
      sticky: true,
      categoryId: `WEBAUTH2`,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }).catch((err) => Response.json({ error: true }));

  const res = await response.json();

  return Response.json({ status: true });
}
