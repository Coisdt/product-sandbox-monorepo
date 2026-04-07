import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Car } from './car.interface';
import ChatBot from './ChatBot';
import { useTheme } from './useTheme';
import styles from './Home.module.css';

function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [cars, setCars] = useState<Car[]>([]);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3333/api/cars')
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
      });
  }, []);

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
      case 'new':                  return 'var(--success)';
      case 'certified-pre-owned':  return 'var(--info)';
      default:                     return 'var(--text-muted)';
    }
  };

  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Car Inventory</h1>
            <p className={styles.subtitle}>
              Discover your perfect vehicle from our curated collection
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={toggleTheme}
              className={styles.themeToggleBtn}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button
              onClick={() => setIsChatBotOpen(true)}
              className={styles.aiBtn}
            >
              <span className={styles.aiBtnIcon}>🤖</span>
              AI Assistant
            </button>
          </div>
        </header>

        <div className={styles.statsGrid}>
          <div className="card">
            <div className={styles.statRow}>
              <div className={`${styles.statIcon} ${styles.statIconAccent}`}>🚗</div>
              <div>
                <h3 className={styles.statCount}>{cars.length}</h3>
                <p className={styles.statLabel}>Available Cars</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className={styles.statRow}>
              <div className={`${styles.statIcon} ${styles.statIconInfo}`}>⚡</div>
              <div>
                <h3 className={styles.statCount}>
                  {cars.filter(car => car.engine.type === 'electric').length}
                </h3>
                <p className={styles.statLabel}>Electric Vehicles</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className={styles.statRow}>
              <div className={`${styles.statIcon} ${styles.statIconSuccess}`}>✨</div>
              <div>
                <h3 className={styles.statCount}>
                  {cars.filter(car => car.condition === 'new').length}
                </h3>
                <p className={styles.statLabel}>New Vehicles</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.carsGrid}>
          {cars.map((car, index) => (
            <div
              key={car.id}
              className={`card slide-up ${styles.carCard}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(`/car/${car.id}`)}
            >
              <div className={styles.carImageWrapper}>
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className={styles.carImage}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.style.background = 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)';
                        parent.style.display = 'flex';
                        parent.style.alignItems = 'center';
                        parent.style.justifyContent = 'center';
                        const overlay = document.createElement('div');
                        overlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);';
                        const emoji = document.createElement('div');
                        emoji.style.cssText = 'color: white; font-size: 4rem; opacity: 0.9; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); z-index: 1;';
                        emoji.textContent = '🚗';
                        parent.appendChild(overlay);
                        parent.appendChild(emoji);
                      }
                    }}
                  />
                ) : (
                  <div className={styles.carImagePlaceholder}>
                    <div className={styles.carImageOverlay} />
                    <div className={styles.carImageEmoji}>🚗</div>
                  </div>
                )}
                <div
                  className={styles.conditionBadge}
                  style={{ backgroundColor: getConditionBadgeColor(car.condition) }}
                >
                  {car.condition}
                </div>
              </div>

              <div className={styles.carBody}>
                <div className={styles.carHeaderSection}>
                  <h3 className={styles.carName}>{car.make} {car.model}</h3>
                  <p className={styles.carMeta}>
                    <span>{car.year}</span>
                    <span className={styles.metaSeparator}>•</span>
                    <span>{car.color}</span>
                    <span className={styles.metaSeparator}>•</span>
                    <span>{car.bodyType}</span>
                  </p>
                </div>

                <div className={styles.priceSection}>
                  {formatPrice(car.price)}
                  <span className={styles.priceCurrency}>USD</span>
                </div>

                <div className={styles.statsRow}>
                  <div className={styles.statBox}>
                    <div className={styles.statBoxLabel}>Mileage</div>
                    <div className={styles.statBoxValue}>{car.mileage.toLocaleString()}</div>
                    <div className={styles.statBoxUnit}>miles</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statBoxLabel}>Fuel Economy</div>
                    <div className={styles.statBoxValue}>{car.fuelEconomy.combined}</div>
                    <div className={styles.statBoxUnit}>mpg combined</div>
                  </div>
                </div>

                <div className={styles.badgesRow}>
                  <span
                    className={styles.engineBadge}
                    style={{ backgroundColor: getEngineTypeColor(car.engine.type) }}
                  >
                    {car.engine.type}
                  </span>
                  <span className={styles.tagBadge}>{car.engine.horsepower} HP</span>
                  <span className={styles.tagBadge}>{car.transmission.type}</span>
                </div>

                {car.features && car.features.length > 0 && (
                  <div className={styles.featuresSection}>
                    <div className={styles.featuresLabel}>Key Features</div>
                    <div className={styles.featuresList}>
                      {car.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className={styles.featureTag}>{feature}</span>
                      ))}
                      {car.features.length > 3 && (
                        <span className={styles.featureTagMore}>
                          +{car.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles.actionButtons}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/car/${car.id}`);
                    }}
                    className={styles.viewDetailsBtn}
                  >
                    View Details
                  </button>
                  <button
                    className={`secondary ${styles.saveBtn}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ❤️ Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className={`card ${styles.emptyState}`}>
            <div className={styles.emptyIcon}>🚗</div>
            <h3 className={styles.emptyTitle}>No cars available</h3>
            <p className={styles.emptyText}>Check back later for new inventory!</p>
          </div>
        )}
      </div>

      <ChatBot isOpen={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />
    </div>
  );
}

export default Home;
