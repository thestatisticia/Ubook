// Accommodation Card Component
export class AccommodationCard {
  constructor(accommodation) {
    this.accommodation = accommodation;
  }

  render() {
    const { name, type, location, rating, images, pricePerNight, description, amenities, available } = this.accommodation;
    
    return `
      <div class="accommodation-card ${!available ? 'unavailable' : ''}" data-id="${this.accommodation.id}">
        <div class="card-image">
          <img src="${images[0]}" alt="${name}" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'">
          ${!available ? '<div class="unavailable-badge">Unavailable</div>' : ''}
        </div>
        <div class="card-content">
          <div class="card-header">
            <h3 class="card-title">${name}</h3>
            <div class="card-rating">
              <span class="rating-stars">${'★'.repeat(Math.floor(rating))}</span>
              <span class="rating-value">${rating}</span>
            </div>
          </div>
          <p class="card-location">${location}</p>
          <p class="card-type">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p class="card-description">${description}</p>
          <div class="card-amenities">
            ${amenities.slice(0, 3).map(amenity => `
              <span class="amenity-tag">${amenity}</span>
            `).join('')}
          </div>
          <div class="card-footer">
            <div class="price-info">
              <span class="price">${pricePerNight} ckUSDC</span>
              <span class="price-label">per night</span>
            </div>
            ${available ? `
              <button class="btn-primary view-details" data-id="${this.accommodation.id}">
                View Details & Book
              </button>
            ` : `
              <button class="btn-secondary" disabled>Not Available</button>
            `}
          </div>
        </div>
      </div>
    `;
  }
}


