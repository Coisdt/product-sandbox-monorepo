import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  bodyType: string;
  engine: {
    type: string;
    displacement?: number;
    horsepower: number;
    torque: number;
  };
  transmission: {
    type: string;
    gears: number;
  };
  drivetrain: string;
  fuelEconomy: {
    city: number;
    highway: number;
    combined: number;
  };
  mileage: number;
  price: number;
  features: string[];
  condition: string;
  vin: string;
  dateAdded: string;
  isAvailable: boolean;
  images?: string[];
  description?: string;
  seller?: {
    name: string;
    contact: string;
    location: string;
  };
}

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
        setImageError(false); // Reset image error state when fetching new car
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
      <div
        className="card"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '0.5rem',
          border: '1px solid var(--border-primary)',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid var(--border-primary)',
              borderTop: '2px solid var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Loading car details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '0.5rem',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'var(--danger)',
          fontSize: '0.95rem',
        }}
      >
        <strong>Error:</strong> {error || 'Car not found'}
      </div>
    );
  }

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        padding: '0.75rem',
        marginTop: '0.5rem',
        border: '1px solid var(--border-primary)',
        maxWidth: '100%',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Car Image */}
      {car.images && car.images.length > 0 && (
        <div
          style={{
            width: '100%',
            height: '120px',
            borderRadius: '6px',
            marginBottom: '0.75rem',
            overflow: 'hidden',
            position: 'relative',
            background: imageError 
              ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)'
              : 'transparent',
            display: imageError ? 'flex' : 'block',
            alignItems: imageError ? 'center' : 'initial',
            justifyContent: imageError ? 'center' : 'initial',
          }}
        >
          {!imageError ? (
            <img
              src={car.images[0]}
              alt={`${car.year} ${car.make} ${car.model}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.2s ease',
              }}
              onError={() => {
                setImageError(true);
              }}
            />
          ) : (
            <div
              style={{
                color: 'white',
                fontSize: '2rem',
                opacity: '0.9',
              }}
            >
              🚗
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            {car.condition}
          </div>
        </div>
      )}

      {/* Compact Header */}
      <div
        style={{
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.5rem',
          }}
        >
          <h4
            style={{
              margin: '0',
              fontSize: '1.125rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              lineHeight: '1.3',
              flex: 1,
              marginRight: '0.75rem',
            }}
          >
            {car.year} {car.make} {car.model}
          </h4>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--accent-primary)',
              lineHeight: '1',
              textAlign: 'right',
              flexShrink: 0,
            }}
          >
            ${car.price.toLocaleString()}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexWrap: 'wrap',
            }}
          >
            <span>{car.color}</span>
            <span>•</span>
            <span>{car.bodyType}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {car.mileage.toLocaleString()} mi
          </span>
        </div>
      </div>

      {/* Description */}
      {car.description && (
        <p
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {car.description}
        </p>
      )}

      {/* Compact Specs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '6px',
            border: '1px solid var(--border-primary)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: '600',
              marginBottom: '0.25rem',
              letterSpacing: '0.5px',
            }}
          >
            Engine
          </div>
          <div
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              fontWeight: '700',
              marginBottom: '0.125rem',
            }}
          >
            {car.engine.horsepower} HP
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              textTransform: 'capitalize',
            }}
          >
            {car.engine.type}
          </div>
        </div>

        <div
          style={{
            padding: '0.5rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '6px',
            border: '1px solid var(--border-primary)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: '600',
              marginBottom: '0.25rem',
              letterSpacing: '0.5px',
            }}
          >
            MPG
          </div>
          <div
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              fontWeight: '700',
              marginBottom: '0.125rem',
            }}
          >
            {car.fuelEconomy.combined}
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
            }}
          >
            combined
          </div>
        </div>

      </div>

      {/* Key Features */}
      {car.features.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: '600',
              marginBottom: '0.375rem',
              letterSpacing: '0.5px',
            }}
          >
            Key Features
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.25rem',
            }}
          >
            {car.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: 'var(--accent-primary)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-muted)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  border: '1px solid var(--border-primary)',
                }}
              >
                +{car.features.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Button - Single compact button */}
      <div
        style={{
          marginTop: '1rem',
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/car/${car.id}`);
          }}
          style={{
            width: '100%',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 4px rgba(34, 197, 94, 0.3)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-secondary)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(34, 197, 94, 0.3)';
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CarRecommendationCard;
