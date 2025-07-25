import { useState, useEffect } from 'react';

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
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
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
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1rem',
          marginTop: '0.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
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
          backgroundColor: '#fef2f2',
          borderRadius: '12px',
          padding: '1rem',
          marginTop: '0.5rem',
          border: '1px solid #fecaca',
          color: '#dc2626',
          fontSize: '0.875rem',
        }}
      >
        <strong>Error:</strong> {error || 'Car not found'}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '0.5rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h3
            style={{
              margin: '0 0 0.25rem 0',
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
            }}
          >
            {car.year} {car.make} {car.model}
          </h3>
          <p
            style={{
              margin: '0',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            {car.color} • {car.bodyType} • {car.condition}
          </p>
        </div>
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#059669',
            }}
          >
            ${car.price.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
            }}
          >
            {car.mileage.toLocaleString()} miles
          </div>
        </div>
      </div>

      {/* Description */}
      {car.description && (
        <p
          style={{
            margin: '0 0 1rem 0',
            fontSize: '0.875rem',
            color: '#374151',
            lineHeight: '1.5',
          }}
        >
          {car.description}
        </p>
      )}

      {/* Specs Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              fontWeight: '500',
              marginBottom: '0.25rem',
            }}
          >
            Engine
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#1f2937',
              fontWeight: '500',
            }}
          >
            {car.engine.horsepower} hp
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
            }}
          >
            {car.engine.type}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              fontWeight: '500',
              marginBottom: '0.25rem',
            }}
          >
            Transmission
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#1f2937',
              fontWeight: '500',
            }}
          >
            {car.transmission.type}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
            }}
          >
            {car.transmission.gears} gears
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              fontWeight: '500',
              marginBottom: '0.25rem',
            }}
          >
            Drivetrain
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#1f2937',
              fontWeight: '500',
              textTransform: 'uppercase',
            }}
          >
            {car.drivetrain}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              fontWeight: '500',
              marginBottom: '0.25rem',
            }}
          >
            MPG
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#1f2937',
              fontWeight: '500',
            }}
          >
            {car.fuelEconomy.combined}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
            }}
          >
            combined
          </div>
        </div>
      </div>

      {/* Features */}
      {car.features.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              fontWeight: '500',
              marginBottom: '0.5rem',
            }}
          >
            Features
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            {car.features.slice(0, 6).map((feature, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                }}
              >
                {feature}
              </span>
            ))}
            {car.features.length > 6 && (
              <span
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                }}
              >
                +{car.features.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Seller Info */}
      {car.seller && (
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              fontWeight: '500',
              marginBottom: '0.5rem',
            }}
          >
            Seller
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#1f2937',
              fontWeight: '500',
            }}
          >
            {car.seller.name}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
            }}
          >
            {car.seller.location} • {car.seller.contact}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <button
          style={{
            flex: 1,
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#2563eb')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#3b82f6')
          }
        >
          View Details
        </button>
        <button
          style={{
            backgroundColor: 'white',
            color: '#3b82f6',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#3b82f6';
          }}
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default CarRecommendationCard;
