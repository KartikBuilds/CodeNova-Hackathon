import './DocumentSummary.css';

const DocumentSummary = ({ summary, title = "Document Summary" }) => {
  if (!summary) {
    return (
      <div className="doc-summary-empty">
        <p>No summary available</p>
      </div>
    );
  }

  // Parse different summary formats
  const renderSection = (section) => {
    if (typeof section === 'string') {
      return <p className="section-text">{section}</p>;
    }

    if (Array.isArray(section)) {
      return (
        <ul className="section-list">
          {section.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }

    if (typeof section === 'object') {
      return (
        <div className="section-table">
          <table>
            <tbody>
              {Object.entries(section).map(([key, value]) => (
                <tr key={key}>
                  <td className="table-key"><strong>{key}</strong></td>
                  <td className="table-value">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="doc-summary-container">
      <div className="summary-header">
        <h2>{title}</h2>
      </div>

      <div className="summary-content">
        {/* Main Topic */}
        {summary.mainTopic && (
          <section className="summary-section">
            <h3 className="section-title">📋 Main Topic / Purpose</h3>
            <div className="section-body">
              {renderSection(summary.mainTopic)}
            </div>
          </section>
        )}

        {/* Key Points */}
        {summary.keyPoints && (
          <section className="summary-section">
            <h3 className="section-title">⭐ Key Points</h3>
            <div className="section-body">
              {typeof summary.keyPoints === 'object' && !Array.isArray(summary.keyPoints) ? (
                <div className="key-points-grid">
                  {Object.entries(summary.keyPoints).map(([key, value], idx) => (
                    <div key={idx} className="key-point-item">
                      <div className="point-label">{key}</div>
                      <div className="point-value">{value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                renderSection(summary.keyPoints)
              )}
            </div>
          </section>
        )}

        {/* Details */}
        {summary.details && (
          <section className="summary-section">
            <h3 className="section-title">📌 Important Details</h3>
            <div className="section-body">
              {renderSection(summary.details)}
            </div>
          </section>
        )}

        {/* Content Breakdown */}
        {summary.contentBreakdown && (
          <section className="summary-section">
            <h3 className="section-title">📄 Content Breakdown</h3>
            <div className="section-body">
              <div className="content-table">
                <table>
                  <thead>
                    <tr>
                      <th>Content Item</th>
                      <th>Details</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.contentBreakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td className="item-name">{item.name}</td>
                        <td className="item-details">{item.details}</td>
                        <td className="item-status">
                          <span className={`status-badge ${item.status?.toLowerCase() || 'info'}`}>
                            {item.status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Metadata */}
        {summary.metadata && (
          <section className="summary-section">
            <h3 className="section-title">🔧 Metadata</h3>
            <div className="section-body">
              <div className="metadata-grid">
                {Object.entries(summary.metadata).map(([key, value]) => (
                  <div key={key} className="metadata-item">
                    <span className="meta-key">{key}</span>
                    <span className="meta-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Conclusion */}
        {summary.conclusion && (
          <section className="summary-section conclusion-section">
            <h3 className="section-title">✅ Conclusion</h3>
            <div className="section-body">
              {renderSection(summary.conclusion)}
            </div>
          </section>
        )}

        {/* Notes */}
        {summary.notes && (
          <section className="summary-section notes-section">
            <h3 className="section-title">📝 Additional Notes</h3>
            <div className="section-body">
              {renderSection(summary.notes)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DocumentSummary;
