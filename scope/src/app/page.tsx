"use client";

import { useState } from "react";
import styles from "./page.module.css";

type CategoryResult = {
  title: string;
  score: number;
};

type Recommendation = {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue: string | null;
  category: string;
  weight: number;
};

type AnalysisResult = {
  performance: CategoryResult;
  accessibility: CategoryResult;
  bestPractices: CategoryResult;
  seo: CategoryResult;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setResults(null);
    setAnalyzedUrl("");
    setRecommendations([]);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/analyze?url=${encodeURIComponent(url)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível analisar o site.");
      }

      const scores = data.scores;

      setResults({
        performance: {
          title: "Desempenho",
          score: scores.performance * 100,
        },
        accessibility: {
          title: "Acessibilidade",
          score: scores.accessibility * 100,
        },
        bestPractices: {
          title: "Boas práticas",
          score: scores.bestPractices * 100,
        },
        seo: {
          title: "SEO",
          score: scores.seo * 100,
        },
      });

      setAnalyzedUrl(
        typeof data.url === "string" ? data.url : url,
      );

      setRecommendations(data.recommendations ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }


  const categories = results ? Object.values(results) : [];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.logo} aria-label="SCOPE — página inicial">
          <span className={styles.logoIcon} aria-hidden="true">
            S
          </span>
          SCOPE
        </a>

        <span className={styles.headerLabel}>Website Intelligence</span>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <span className={styles.eyebrow}>
          <span className={styles.statusDot} aria-hidden="true" />
          ANÁLISE INTELIGENTE DE WEBSITES
        </span>

        <h1 id="hero-title">
          Seu site tem o desempenho
          <br />
          que você <span>imagina?</span>
        </h1>

        <p className={styles.description}>
          Descubra problemas de desempenho, acessibilidade e SEO. Transforme
          dados técnicos em melhorias reais para o seu site.
        </p>

        <form
          className={styles.searchForm}
          onSubmit={handleSubmit}
          aria-busy={loading}
        >
          <label htmlFor="website-url" className={styles.srOnly}>
            URL do site que deseja analisar
          </label>

          <span className={styles.linkIcon} aria-hidden="true">
            ↗
          </span>

          <input
            id="website-url"
            name="url"
            type="url"
            placeholder="https://seusite.com"
            autoComplete="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? "analysis-error" : "analysis-status"
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? "Analisando..." : "Analisar site"}
            {!loading && <span aria-hidden="true"> →</span>}
          </button>
        </form>

        {error && (
          <p
            id="analysis-error"
            className={styles.error}
            role="alert"
          >
            {error}
          </p>
        )}

        <p
          id="analysis-status"
          className={styles.helper}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {loading
            ? "Estamos analisando o site. Isso pode levar alguns segundos."
            : "Análise de desempenho baseada em dados reais."}
        </p>
      </section>

      {results && (
        <section
          className={styles.results}
          aria-labelledby="results-title"
          aria-live="polite"
          aria-busy={loading}
        >
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.eyebrow}>RELATÓRIO DO SITE</span>
              <h2 id="results-title">Resultado da análise</h2>
            </div>

            <p className={styles.analyzedUrl}>
              {analyzedUrl}
            </p>
          </div>

          <div className={styles.resultsGrid}>
            {categories.map((category) => (
              <article className={styles.resultCard} key={category.title}>
                <span className={styles.resultTitle}>
                  {category.title}
                </span>

                <strong className={styles.resultScore}>
                  {category.score === null
                    ? "—"
                    : Math.round(category.score)}
                  <span>/100</span>
                </strong>

                {category.score !== null ? (
                  <div
                    className={styles.scoreTrack}
                    role="progressbar"
                    aria-label={`Pontuação de ${category.title}`}
                    aria-valuenow={Math.round(category.score)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuetext={`${Math.round(category.score)} de 100`}
                  >
                    <div
                      className={styles.scoreFill}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                ) : (
                  <p role="status">Pontuação indisponível.</p>
                )}

                <span className={styles.scoreLabel}>
                  {category.score === null
                    ? "Indisponível"
                    : category.score >= 90
                      ? "Bom"
                      : category.score >= 50
                        ? "Precisa melhorar"
                        : "Ruim"}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      {results && (
        <section
          className={styles.recommendations}
          aria-labelledby="recommendations-title"
        >
          <div className={styles.recommendationsHeader}>
            <span className={styles.eyebrow}>PRÓXIMOS PASSOS</span>
            <h2 id="recommendations-title">O que pode melhorar?</h2>
            <p>
              Oportunidades identificadas durante a análise do seu site.
            </p>
          </div>

          {recommendations.length === 0 ? (
            <p className={styles.emptyRecommendations} role="status">
              Nenhuma oportunidade de melhoria foi encontrada nas auditorias
              selecionadas.
            </p>
          ) : (
            <div className={styles.recommendationsList}>
              {recommendations.map((item) => (
                <article className={styles.recommendationCard} key={item.id}>
                  <div className={styles.recommendationTop}>
                    <span className={styles.recommendationCategory}>
                      {item.category}
                    </span>

                    <span className={styles.recommendationScore}>
                      {item.score === 0 ? "Não aprovado" : "Pode melhorar"}
                    </span>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  {item.displayValue && (
                    <span className={styles.recommendationDetail}>
                      {item.displayValue}
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <section className={styles.features} aria-label="Recursos do SCOPE">
        <article className={styles.feature}>
          <span className={styles.featureNumber} aria-hidden="true">
            01
          </span>
          <h2>Desempenho</h2>
          <p>
            Entenda a velocidade de carregamento e a experiência de quem visita
            sua página.
          </p>
        </article>

        <article className={styles.feature}>
          <span className={styles.featureNumber} aria-hidden="true">
            02
          </span>
          <h2>Acessibilidade</h2>
          <p>
            Identifique barreiras que dificultam o acesso ao conteúdo por
            diferentes usuários.
          </p>
        </article>

        <article className={styles.feature}>
          <span className={styles.featureNumber} aria-hidden="true">
            03
          </span>
          <h2>SEO e boas práticas</h2>
          <p>
            Descubra oportunidades para melhorar a estrutura e a qualidade
            técnica do seu site.
          </p>
        </article>
      </section>

      <footer className={styles.footer}>
        <span>SCOPE © 2026</span>
        <span>Construa experiências melhores.</span>
      </footer>
    </main>
  );
}
