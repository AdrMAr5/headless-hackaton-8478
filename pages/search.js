import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getNextStaticProps } from "@faustwp/core";

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (q) {
      setSearchTerm(q);
      performSearch(q);
    }
  }, [q]);

  const performSearch = async (query, offset = 0) => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `/api/search?q=${encodeURIComponent(query)}&limit=10&offset=${offset}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Search failed');
      }
      
      if (offset === 0) {
        setData(result);
      } else {
        // Append results for pagination
        setData(prev => ({
          ...result,
          results: [...(prev?.results || []), ...result.results]
        }));
      }
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (data?.results && searchTerm) {
      performSearch(searchTerm, data.results.length);
    }
  };

  if (!searchTerm) {
    return (
      <div>
        <Header 
          siteTitle="Search" 
          siteDescription="Search the Wild Atlantic Way" 
          menuItems={[]} 
        />
        <main className="container">
          <h1>Search</h1>
          <p>Please enter a search term.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div>
        <Header 
          siteTitle="Search" 
          siteDescription="Search the Wild Atlantic Way" 
          menuItems={[]} 
        />
        <main className="container">
          <h1>Searching...</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="spinner"></div>
            <span>Searching for "{searchTerm}"...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header 
          siteTitle="Search" 
          siteDescription="Search the Wild Atlantic Way" 
          menuItems={[]} 
        />
        <main className="container">
          <h1>Search Error</h1>
          <p>There was an error performing your search. Please try again.</p>
          <p>Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const allResults = data?.results || [];
  const totalResults = data?.totalResults || 0;
  const hasNextPage = data?.pagination?.hasNextPage || (allResults.length < totalResults);

  return (
    <div>
      <Header 
        siteTitle="The Wild Atlantic Way" 
        siteDescription="Search Results" 
        menuItems={[]}
      />
      <main className="container">
        <h1>Search Results</h1>
        <p>
          {totalResults > 0 
            ? `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${searchTerm}"`
            : `No results found for "${searchTerm}"`
          }
        </p>

        {data?.fallback && (
          <div className="notice warning">
            <strong>Note:</strong> Using fallback search. For enhanced results, configure WP Engine Smart Search.
          </div>
        )}

        {totalResults > 0 && (
          <div className="results-list">
            {allResults.map((item) => (
              <article key={item.id} className="result-item">
                <h2 className="result-title">
                  <Link href={item.url}>
                    {item.title}
                  </Link>
                </h2>
                
                <div className="result-meta">
                  {item.type && (
                    <span className="result-type">{item.type}</span>
                  )}
                  {item.author && (
                    <span>By {item.author} • </span>
                  )}
                  {item.date && (
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  )}
                  {item.score && (
                    <span className="result-score">
                      Relevance: {(item.score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                {item.excerpt && (
                  <div 
                    className="result-excerpt"
                    dangerouslySetInnerHTML={{ __html: item.excerpt }}
                  />
                )}
              </article>
            ))}

            {hasNextPage && (
              <div className="load-more-container">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="load-more-button"
                >
                  {loading ? 'Loading...' : 'Load More Results'}
                </button>
              </div>
            )}
          </div>
        )}

        {totalResults === 0 && data && (
          <div className="search-tips">
            <h3>Search Tips:</h3>
            <ul>
              <li>Check your spelling</li>
              <li>Try different keywords</li>
              <li>Use more general terms</li>
            </ul>
          </div>
        )}
      </main>
      <Footer />
      
      <style jsx>{`
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-color);
          border-top: 2px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .notice {
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
          border: 1px solid;
        }
        .warning {
          background: #fff3cd; 
          border-color: #ffeaa7; 
          color: #856404;
        }
        .results-list {
          margin-top: 2rem;
        }
        .result-item {
          margin-bottom: 2.5rem; 
          padding-bottom: 2.5rem; 
          border-bottom: 1px solid var(--border-color);
        }
        .result-item:last-child {
            border-bottom: none;
        }
        .result-title a {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 1.75rem;
        }
        .result-title a:hover {
            color: var(--secondary-color);
            text-decoration: underline;
        }
        .result-meta {
          font-size: 0.9rem; 
          color: #6c757d; 
          margin: 0.5rem 0;
        }
        .result-type {
          background: var(--light-grey); 
          padding: 3px 8px; 
          border-radius: 4px; 
          font-size: 0.8rem;
          margin-right: 8px;
          text-transform: uppercase;
          font-weight: bold;
        }
        .result-score {
            margin-left: 1rem;
            color: #28a745;
            font-weight: bold;
        }
        .result-excerpt {
          color: var(--text-color-dark); 
          line-height: 1.6;
        }
        .load-more-container {
            text-align: center;
            margin-top: 2rem;
        }
        .load-more-button {
          background: ${loading ? '#6c757d' : 'var(--primary-color)'};
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: ${loading ? 'not-allowed' : 'pointer'};
          font-size: 1rem;
          font-weight: bold;
          text-transform: uppercase;
          transition: background-color 0.2s ease;
        }
        .load-more-button:hover:not(:disabled) {
            background: var(--secondary-color);
        }
        .search-tips {
            margin-top: 2rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}