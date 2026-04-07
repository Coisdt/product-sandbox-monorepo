import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Car } from './car.interface';
import ChatBot from './ChatBot';
import { useTheme } from './useTheme';
import styles from './CarDetails.module.css';

function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3333/api/cars/${id}`);

        if (!response.ok) {
          throw new Error(`Car with ID ${id} not found`);
        }

        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch car details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getEngineTypeColor = (type: string) => {
    switch (type) {
      case 'electric': return 'var(--success)';
      case 'hybrid':   return 'var(--info)';
      case 'diesel':   return 'var(--warning)';
      default:         return 'var(--text-muted)';
    }
  };

  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case 'new':                 return 'var(--success)';
      case 'certified-pre-owned': return 'var(--info)';
      default:                    return 'var(--text-muted)';
    }
  };

  if (loading) {
    return (
      <div className={`${styles.loadingPage} fade-in`}>
        <div className={`card ${styles.loadingCard}`}>
          <div className={styles.spinner} />
          <h3 className={styles.loadingTitle}>Loading Car Details</h3>
          <p className={styles.loadingText}>
            Please wait while we fetch the information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className={`${styles.errorPage} fade-in`}>
        <div className={styles.errorBox}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Car Not Found</h3>
          <p className={styles.errorMessage}>
            {error || 'The car you are looking for could not be found.'}
          </p>
          <button onClick={() => navigate('/')} className={styles.errorBackBtn}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.container}>
        <div className={styles.navRow}>
          <button onClick={() => navigate('/')} className={styles.backBtn}>
            ← Back to Inventory
          </button>
          <button
            onClick={toggleTheme}
            className={styles.themeToggleBtn}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="details-grid">
          <div>
            <div className={`card ${styles.heroCard}`}>
              <div className={styles.heroImageWrapper}>
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className={styles.heroImage}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.style.background =
                          'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)';
                        parent.style.display = 'flex';
                        parent.style.alignItems = 'center';
                        parent.style.justifyContent = 'center';
                        const overlay = document.createElement('div');
                        overlay.style.cssText =
                          'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);';
                        const emoji = document.createElement('div');
                        emoji.style.cssText =
                          'color: white; font-size: 6rem; opacity: 0.9; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3)); z-index: 1;';
                        emoji.textContent = '🚗';
                        parent.appendChild(overlay);
                        parent.appendChild(emoji);
                      }
                    }}
                  />
                ) : (
                  <div className={styles.heroImagePlaceholder}>
                    <div className={styles.heroImageOverlay} />
                    <div className={styles.heroImageEmoji}>🚗</div>
                  </div>
                )}
                <div
                  className={styles.conditionBadge}
                  style={{ backgroundColor: getConditionBadgeColor(car.condition) }}
                >
                  {car.condition}
                </div>
              </div>
            </div>

            <div className={`card ${styles.titleCard}`}>
              <div className={styles.titleRow}>
                <div>
                  <h1 className={styles.carTitle}>
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div className={styles.titleSubRow}>
                    <span className={styles.titleSubText}>
                      {car.color} • {car.bodyType}
                    </span>
                    <span
                      className={styles.engineTypeBadge}
                      style={{ backgroundColor: getEngineTypeColor(car.engine.type) }}
                    >
                      {car.engine.type}
                    </span>
                  </div>
                </div>
                <div className={styles.priceBlock}>
                  <div className={styles.priceValue}>{formatPrice(car.price)}</div>
                  <div className={styles.priceMileage}>
                    {car.mileage.toLocaleString()} miles
                  </div>
                </div>
              </div>

              {car.description && (
                <p className={styles.description}>{car.description}</p>
              )}
            </div>

            <div className={`card ${styles.specsCard}`}>
              <h2 className={styles.specsTitle}>Specifications</h2>
              <div className={styles.specsGrid}>
                <div>
                  <h3 className={styles.specGroupTitle}>Engine</h3>
                  <div className={styles.specGroup}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Type:</span>
                      <span className={styles.specValueCapitalize}>{car.engine.type}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Horsepower:</span>
                      <span className={styles.specValue}>{car.engine.horsepower} HP</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Torque:</span>
                      <span className={styles.specValue}>{car.engine.torque} lb-ft</span>
                    </div>
                    {car.engine.displacement && (
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>Displacement:</span>
                        <span className={styles.specValue}>{car.engine.displacement}L</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className={styles.specGroupTitle}>Drivetrain</h3>
                  <div className={styles.specGroup}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Transmission:</span>
                      <span className={styles.specValue}>{car.transmission.type}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Gears:</span>
                      <span className={styles.specValue}>{car.transmission.gears}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Drive Type:</span>
                      <span className={styles.specValueUpper}>{car.drivetrain}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={styles.specGroupTitle}>Fuel Economy</h3>
                  <div className={styles.specGroup}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>City:</span>
                      <span className={styles.specValue}>{car.fuelEconomy.city} mpg</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Highway:</span>
                      <span className={styles.specValue}>{car.fuelEconomy.highway} mpg</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Combined:</span>
                      <span className={styles.specValue}>{car.fuelEconomy.combined} mpg</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={styles.specGroupTitle}>Vehicle Info</h3>
                  <div className={styles.specGroup}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>VIN:</span>
                      <span className={styles.specValueMono}>{car.vin}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Date Added:</span>
                      <span className={styles.specValue}>
                        {new Date(car.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Status:</span>
                      <span className={car.isAvailable ? styles.available : styles.sold}>
                        {car.isAvailable ? 'Available' : 'Sold'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {car.features && car.features.length > 0 && (
              <div className={`card ${styles.featuresCard}`}>
                <h2 className={styles.featuresTitle}>Features & Options</h2>
                <div className={styles.featuresGrid}>
                  {car.features.map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                      <span className={styles.featureCheck}>✓</span>
                      <span className={styles.featureText}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className={`card ${styles.stickyCard}`}>
              <h3 className={styles.contactTitle}>Contact Details</h3>

              {car.seller ? (
                <div className={styles.sellerBlock}>
                  <div className={styles.sellerInfo}>
                    <h4 className={styles.sellerName}>{car.seller.name}</h4>
                    <div className={styles.sellerDetails}>
                      <div className={styles.sellerDetailRow}>
                        <span className={styles.sellerDetailIcon}>📍</span>
                        <span className={styles.sellerDetailText}>{car.seller.location}</span>
                      </div>
                      <div className={styles.sellerDetailRow}>
                        <span className={styles.sellerDetailIcon}>📞</span>
                        <span className={styles.sellerDetailText}>{car.seller.contact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.noContact}>
                  <p className={styles.noContactText}>
                    Contact information not available
                  </p>
                </div>
              )}

              <div className={styles.actionButtons}>
                <button
                  onClick={() => setIsChatBotOpen(true)}
                  className={styles.primaryBtn}
                >
                  🤖 Ask AI About This Car
                </button>
                <button className={styles.secondaryBtn}>💬 Contact Seller</button>
                <button className={styles.secondaryBtn}>❤️ Save to Favorites</button>
                <button className={styles.secondaryBtn}>📄 Generate Report</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatBot isOpen={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />
    </div>
  );
}

export default CarDetails;
