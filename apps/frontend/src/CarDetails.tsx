import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Car } from './car.interface';
import ChatBot from './ChatBot';
import { useTheme } from './ThemeContext';

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
      case 'electric':
        return 'var(--success)';
      case 'hybrid':
        return 'var(--info)';
      case 'diesel':
        return 'var(--warning)';
      default:
        return 'var(--text-muted)';
    }
  };

  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'var(--success)';
      case 'certified-pre-owned':
        return 'var(--info)';
      default:
        return 'var(--text-muted)';
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="fade-in"
      >
        <div
          className="card"
          style={{
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid var(--border-primary)',
              borderTop: '3px solid var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem',
            }}
          />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Loading Car Details
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Please wait while we fetch the information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
        className="fade-in"
      >
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '500px',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
            }}
          >
            ⚠️
          </div>
          <h3
            style={{
              color: 'var(--danger)',
              marginBottom: '1rem',
              fontSize: '1.5rem',
            }}
          >
            Car Not Found
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              fontSize: '1.125rem',
            }}
          >
            {error || 'The car you are looking for could not be found.'}
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-secondary)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        padding: '2rem',
      }}
      className="fade-in"
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              border: 'none',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.5rem 0',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            ← Back to Inventory
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '10px',
              fontSize: '1.125rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              e.currentTarget.style.borderColor = 'var(--border-secondary)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="details-grid">
          {/* Left Column - Main Details */}
          <div>
            {/* Hero Image Section */}
            <div
              className="card"
              style={{
                padding: '0',
                overflow: 'hidden',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  height: '400px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
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
                  <div
                    style={{
                      height: '100%',
                      background:
                        'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background:
                          'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                      }}
                    />
                    <div
                      style={{
                        color: 'white',
                        fontSize: '6rem',
                        opacity: '0.9',
                        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                      }}
                    >
                      🚗
                    </div>
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    backgroundColor: getConditionBadgeColor(car.condition),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  {car.condition}
                </div>
              </div>
            </div>

            {/* Car Title & Price */}
            <div
              className="card"
              style={{
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: '0 0 0.5rem 0',
                      lineHeight: '1.2',
                    }}
                  >
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.125rem',
                      }}
                    >
                      {car.color} • {car.bodyType}
                    </span>
                    <span
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: getEngineTypeColor(car.engine.type),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {car.engine.type}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3rem',
                      fontWeight: '700',
                      color: 'var(--accent-primary)',
                      lineHeight: '1',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {formatPrice(car.price)}
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {car.mileage.toLocaleString()} miles
                  </div>
                </div>
              </div>

              {car.description && (
                <p
                  style={{
                    fontSize: '1.125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    margin: '0',
                  }}
                >
                  {car.description}
                </p>
              )}
            </div>

            {/* Detailed Specifications */}
            <div
              className="card"
              style={{
                marginBottom: '2rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '1.5rem',
                }}
              >
                Specifications
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '2rem',
                }}
              >
                {/* Engine Details */}
                <div>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Engine
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Type:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          textTransform: 'capitalize',
                        }}
                      >
                        {car.engine.type}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Horsepower:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {car.engine.horsepower} HP
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Torque:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {car.engine.torque} lb-ft
                      </span>
                    </div>
                    {car.engine.displacement && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Displacement:
                        </span>
                        <span
                          style={{
                            color: 'var(--text-primary)',
                            fontWeight: '500',
                          }}
                        >
                          {car.engine.displacement}L
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transmission & Drivetrain */}
                <div>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Drivetrain
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Transmission:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {car.transmission.type}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Gears:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {car.transmission.gears}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Drive Type:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                        }}
                      >
                        {car.drivetrain}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fuel Economy */}
                <div>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Fuel Economy
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        City:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {car.fuelEconomy.city} mpg
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Highway:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {car.fuelEconomy.highway} mpg
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Combined:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {car.fuelEconomy.combined} mpg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Vehicle Info
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        VIN:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          fontFamily: 'monospace',
                        }}
                      >
                        {car.vin}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Date Added:
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {new Date(car.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Status:
                      </span>
                      <span
                        style={{
                          color: car.isAvailable
                            ? 'var(--success)'
                            : 'var(--danger)',
                          fontWeight: '500',
                        }}
                      >
                        {car.isAvailable ? 'Available' : 'Sold'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            {car.features && car.features.length > 0 && (
              <div
                className="card"
                style={{
                  marginBottom: '2rem',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '1.5rem',
                  }}
                >
                  Features & Options
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {car.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-primary)',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--accent-primary)',
                          fontSize: '0.875rem',
                        }}
                      >
                        ✓
                      </span>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Actions */}
          <div>
            {/* Contact Card */}
            <div
              className="card"
              style={{
                marginBottom: '2rem',
                position: 'sticky',
                top: '2rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '1.5rem',
                }}
              >
                Contact Details
              </h3>

              {car.seller ? (
                <div style={{ marginBottom: '2rem' }}>
                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-primary)',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {car.seller.name}
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                          }}
                        >
                          📍
                        </span>
                        <span
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                          }}
                        >
                          {car.seller.location}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                          }}
                        >
                          📞
                        </span>
                        <span
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                          }}
                        >
                          {car.seller.contact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-primary)',
                    marginBottom: '2rem',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ color: 'var(--text-secondary)', margin: '0' }}>
                    Contact information not available
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <button
                  onClick={() => setIsChatBotOpen(true)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--accent-secondary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(34, 197, 94, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(34, 197, 94, 0.3)';
                  }}
                >
                  🤖 Ask AI About This Car
                </button>

                <button
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--bg-tertiary)';
                    e.currentTarget.style.borderColor =
                      'var(--border-secondary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  💬 Contact Seller
                </button>

                <button
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--bg-tertiary)';
                    e.currentTarget.style.borderColor =
                      'var(--border-secondary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ❤️ Save to Favorites
                </button>

                <button
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--bg-tertiary)';
                    e.currentTarget.style.borderColor =
                      'var(--border-secondary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  📄 Generate Report
                </button>
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
