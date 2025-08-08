import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Car } from './car.interface';
import ChatBot from './ChatBot';
import { useTheme } from './ThemeContext';

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
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header Section */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: '0 0 0.5rem 0',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Car Inventory
            </h1>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.125rem',
                margin: 0,
              }}
            >
              Discover your perfect vehicle from our curated collection
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                fontSize: '1.25rem',
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
            
            {/* AI Assistant Button */}
            <button
              onClick={() => setIsChatBotOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.75rem',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-secondary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>🤖</span>
              AI Assistant
            </button>
          </div>
        </header>

        {/* Stats Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--accent-primary)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                🚗
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {cars.length}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Available Cars
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--info)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                ⚡
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {cars.filter(car => car.engine.type === 'electric').length}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Electric Vehicles
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--success)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                ✨
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {cars.filter(car => car.condition === 'new').length}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  New Vehicles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          {cars.map((car, index) => (
            <div
              key={car.id}
              className="card slide-up"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid var(--border-primary)',
                animationDelay: `${index * 0.1}s`,
              }}
              onClick={() => navigate(`/car/${car.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'var(--border-secondary)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
              }}
            >
              {/* Car Image */}
              <div
                style={{
                  height: '220px',
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        height: '100%',
                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
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
                          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        }}
                      />
                      <div
                        style={{
                          color: 'white',
                          fontSize: '4rem',
                          opacity: '0.9',
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                        }}
                      >
                        🚗
                      </div>
                    </div>
                  </>
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: getConditionBadgeColor(car.condition),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {car.condition}
                </div>
              </div>

              {/* Car Details */}
              <div style={{ padding: '2rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem',
                      lineHeight: '1.2',
                    }}
                  >
                    {car.make} {car.model}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>{car.year}</span>
                    <span style={{ color: 'var(--border-secondary)' }}>•</span>
                    <span>{car.color}</span>
                    <span style={{ color: 'var(--border-secondary)' }}>•</span>
                    <span>{car.bodyType}</span>
                  </p>
                </div>

                {/* Price */}
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--accent-primary)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.5rem',
                  }}
                >
                  {formatPrice(car.price)}
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      fontWeight: '400',
                    }}
                  >
                    USD
                  </span>
                </div>

                {/* Key Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      textAlign: 'center',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600',
                      }}
                    >
                      Mileage
                    </div>
                    <div
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {car.mileage.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.25rem',
                      }}
                    >
                      miles
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      textAlign: 'center',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600',
                      }}
                    >
                      Fuel Economy
                    </div>
                    <div
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {car.fuelEconomy.combined}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.25rem',
                      }}
                    >
                      mpg combined
                    </div>
                  </div>
                </div>

                {/* Engine & Transmission */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: getEngineTypeColor(car.engine.type),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {car.engine.type}
                  </span>
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    {car.engine.horsepower} HP
                  </span>
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    {car.transmission.type}
                  </span>
                </div>

                {/* Features */}
                {car.features && car.features.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Key Features
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      {car.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            color: 'var(--accent-primary)',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
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
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-muted)',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: '1px solid var(--border-primary)',
                          }}
                        >
                          +{car.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/car/${car.id}`);
                    }}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-secondary)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="secondary"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'transparent',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '120px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      e.currentTarget.style.borderColor = 'var(--border-secondary)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border-primary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ❤️ Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'var(--bg-card)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2rem',
              }}
            >
              🚗
            </div>
            <h3
              style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: 'var(--text-primary)',
              }}
            >
              No cars available
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.125rem',
              }}
            >
              Check back later for new inventory!
            </p>
          </div>
        )}
      </div>

      <ChatBot isOpen={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />
    </div>
  );
}

export default Home;
