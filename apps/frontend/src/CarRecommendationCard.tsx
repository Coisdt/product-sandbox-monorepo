import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Car } from './car.interface';
import styles from './CarRecommendationCard.module.css';

interface CarRecommendationCardProps {
  carId: string;
}

const CarRecommendationCard: React.FC<CarRecommendationCardProps> = ({
  carId,
}) => {
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setImageError(false);
        const response = await fetch(`http://localhost:3333/api/cars/${carId}`);

        if (!response.ok) {
          throw new Error(`Car with ID ${carId} not found`);
        }

        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch car');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <div className={styles.loadingCard}>
        <div className={styles.loadingRow}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading car details...</span>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className={styles.errorCard}>
        <strong>Error:</strong> {error || 'Car not found'}
      </div>
    );
  }

  return (
    <div className={`fade-in ${styles.card}`}>
      {car.images && car.images.length > 0 && (
        <div
          className={`${styles.imageWrapper} ${imageError ? styles.imageWrapperError : ''}`}
        >
          {!imageError ? (
            <img
              src={car.images[0]}
              alt={`${car.year} ${car.make} ${car.model}`}
              className={styles.image}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={styles.imageFallbackEmoji}>🚗</div>
          )}
          <div className={styles.imageBadge}>{car.condition}</div>
        </div>
      )}

      <div className={styles.cardHeader}>
        <div className={styles.titleRow}>
          <h4 className={styles.carTitle}>
            {car.year} {car.make} {car.model}
          </h4>
          <div className={styles.carPrice}>${car.price.toLocaleString()}</div>
        </div>
        <div className={styles.metaRow}>
          <div className={styles.metaLeft}>
            <span>{car.color}</span>
            <span>•</span>
            <span>{car.bodyType}</span>
          </div>
          <span className={styles.mileage}>{car.mileage.toLocaleString()} mi</span>
        </div>
      </div>

      {car.description && (
        <p className={styles.description}>{car.description}</p>
      )}

      <div className={styles.specsGrid}>
        <div className={styles.specBox}>
          <div className={styles.specLabel}>Engine</div>
          <div className={styles.specValue}>{car.engine.horsepower} HP</div>
          <div className={styles.specSubValue}>{car.engine.type}</div>
        </div>
        <div className={styles.specBox}>
          <div className={styles.specLabel}>MPG</div>
          <div className={styles.specValue}>{car.fuelEconomy.combined}</div>
          <div className={styles.specSubValue}>combined</div>
        </div>
      </div>

      {car.features.length > 0 && (
        <div className={styles.featuresSection}>
          <div className={styles.featuresLabel}>Key Features</div>
          <div className={styles.featuresList}>
            {car.features.slice(0, 3).map((feature, index) => (
              <span key={index} className={styles.featureTag}>{feature}</span>
            ))}
            {car.features.length > 3 && (
              <span className={styles.featureTagMore}>
                +{car.features.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={styles.actionWrapper}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/car/${car.id}`);
          }}
          className={styles.viewBtn}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CarRecommendationCard;
