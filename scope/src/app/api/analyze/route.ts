import { NextResponse } from "next/server";

const categories = ["PERFORMANCE", "ACCESSIBILITY", "BEST_PRACTICES", "SEO"];

async function translateTexts(texts: string[]): Promise<string[]> {
  try {
    const response = await fetch("http://127.0.0.1:8000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texts }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Falha no serviço de tradução.");
    }

    const data = await response.json();

    if (
      !Array.isArray(data.translations) ||
      data.translations.length !== texts.length
    ) {
      throw new Error("Resposta de tradução inválida.");
    }

    return data.translations;
  } catch {
    return texts;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "A URL do site é obrigatória." },
        { status: 400 },
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Informe uma URL válida." },
        { status: 400 },
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "A URL precisa usar HTTP ou HTTPS." },
        { status: 400 },
      );
    }

    const apiKey = process.env.PAGESPEED_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API não configurada no servidor." },
        { status: 500 },
      );
    }

    const params = new URLSearchParams({
      url: parsedUrl.toString(),
      key: apiKey,
      locale: "pt-BR",
    });

    categories.forEach((category) => {
      params.append("category", category);
    });

    const response = await fetch(
      `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
      { cache: "no-store" },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? "Falha ao analisar o site." },
        { status: response.status },
      );
    }

    const lighthouse = data.lighthouseResult;
    const lighthouseCategories = lighthouse?.categories;
    const audits = lighthouse?.audits ?? {};

    if (!lighthouseCategories) {
      return NextResponse.json(
        { error: "O Google não retornou os resultados esperados." },
        { status: 502 },
      );
    }

    const scores = {
      performance: lighthouseCategories.performance?.score,
      accessibility: lighthouseCategories.accessibility?.score,
      bestPractices: lighthouseCategories["best-practices"]?.score,
      seo: lighthouseCategories.seo?.score,
    };

    const recommendationsRaw = Object.values(lighthouseCategories)
      .flatMap((category: any) =>
        (category.auditRefs ?? [])
          .filter(
            (audit: any) =>
              audit.weight > 0 &&
              !["numeric", "metricSavings"].includes(
                audits[audit.id]?.details?.type,
              ) &&
              audits[audit.id]?.score !== null &&
              audits[audit.id]?.score < 1,
          )
          .map((audit: any) => {
            const result = audits[audit.id];

            return {
              id: audit.id,
              title: result.title,
              description: result.description,
              score: result.score,
              displayValue: result.displayValue ?? null,
              category: category.title,
              weight: audit.weight,
            };
          }),
      )
      .filter(
        (audit, index, all) =>
          all.findIndex((item) => item.id === audit.id) === index,
      )
      .sort((a, b) => a.score - b.score)
      .slice(0, 15);

    const translatedTexts = await translateTexts(
      recommendationsRaw.flatMap((item) => [
        item.title,
        item.description,
        item.category,
      ]),
    );

    const recommendations = recommendationsRaw
      .map((item, index) => ({
        ...item,
        title: translatedTexts[index * 3] ?? item.title,
        description: translatedTexts[index * 3 + 1] ?? item.description,
        category: translatedTexts[index * 3 + 2] ?? item.category,
      }))

      .filter(
        (audit, index, all) =>
          all.findIndex((item) => item.id === audit.id) === index,
      )
      .sort((a, b) => a.score - b.score)
      .slice(0, 15);

    return NextResponse.json({
      url: lighthouse.finalDisplayedUrl ?? parsedUrl.toString(),
      scores,
      recommendations,
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível concluir a análise. Tente novamente." },
      { status: 500 },
    );
  }
}
