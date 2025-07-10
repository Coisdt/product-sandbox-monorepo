import { useEffect, useState } from 'react';
import type { Car } from './car.interface';

function Home() {
  const [cars, setCars] = useState<Car[]>([]);

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
      case 'electric':
        return '#22c55e';
      case 'hybrid':
        return '#3b82f6';
      case 'diesel':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return '#10b981';
      case 'certified-pre-owned':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '2rem',
      }}
    >
      <div
        style={{
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          Car Inventory
        </h1>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {cars.map((car) => (
            <div
              key={car.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #e5e7eb',
                width: '400px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
            >
              {/* Car Image Placeholder */}
              <div
                style={{
                  height: '200px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '3rem',
                    opacity: '0.8',
                  }}
                >
                  🚗
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: getConditionBadgeColor(car.condition),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  {car.condition}
                </div>
              </div>

              {/* Car Details */}
              <div style={{ padding: '1.5rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {car.make} {car.model}
                  </h3>
                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      margin: 0,
                    }}
                  >
                    {car.year} • {car.color} • {car.bodyType}
                  </p>
                </div>

                {/* Price */}
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#059669',
                    marginBottom: '1rem',
                  }}
                >
                  {formatPrice(car.price)}
                </div>

                {/* Key Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Mileage
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      {car.mileage.toLocaleString()} mi
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Fuel Economy
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      {car.fuelEconomy.combined} mpg
                    </div>
                  </div>
                </div>

                {/* Engine & Transmission */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: getEngineTypeColor(car.engine.type),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {car.engine.type}
                  </span>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {car.engine.horsepower} HP
                  </span>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {car.transmission.type}
                  </span>
                </div>

                {/* Features */}
                {car.features && car.features.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem',
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
                            padding: '0.125rem 0.375rem',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                      {car.features.length > 3 && (
                        <span
                          style={{
                            padding: '0.125rem 0.375rem',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                          }}
                        >
                          +{car.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#6b7280',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              No cars available
            </h3>
            <p>Check back later for new inventory!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
