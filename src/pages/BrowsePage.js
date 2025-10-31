// Browse Page Component
import { SAMPLE_ACCOMMODATIONS } from '../config/constants.js';
import { getAllAccommodations } from '../utils/storage.js';
import { AccommodationCard } from '../components/AccommodationCard.js';

export class BrowsePage {
  constructor(currentUser, walletConnection) {
    this.currentUser = currentUser;
    this.walletConnection = walletConnection;
  }

  render() {
    return `
      <div class="browse-page">
        <div class="page-header">
          <h1>Browse Accommodations</h1>
          <p>Choose from hotels, homestays, and restaurants across Uganda</p>
        </div>

        <div class="filter-section">
          <div class="filters">
            <select class="filter-select" id="type-filter">
              <option value="">All Types</option>
              <option value="hotel">Hotels</option>
              <option value="homestay">Homestays</option>
              <option value="restaurant-hotel">Restaurants</option>
            </select>
            <select class="filter-select" id="location-filter">
              <option value="">All Locations</option>
              <option value="Kampala">Kampala</option>
              <option value="Bwindi">Bwindi</option>
              <option value="Jinja">Jinja</option>
              <option value="Queen Elizabeth">Queen Elizabeth</option>
              <option value="Mbarara">Mbarara</option>
              <option value="Entebbe">Entebbe</option>
            </select>
            <input type="text" class="filter-input" id="search-input" placeholder="Search by name...">
          </div>
          <div class="results-count">
            <span id="results-count">${SAMPLE_ACCOMMODATIONS.length} accommodations found</span>
          </div>
        </div>

        <div class="accommodations-grid" id="accommodations-list">
          ${(getAllAccommodations().length ? getAllAccommodations() : SAMPLE_ACCOMMODATIONS).map(acc => {
            const card = new AccommodationCard(acc);
            return card.render();
          }).join('')}
        </div>

        <div class="no-results" id="no-results" style="display: none;">
          <p>No accommodations found matching your filters.</p>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const typeFilter = document.getElementById('type-filter');
    const locationFilter = document.getElementById('location-filter');
    const searchInput = document.getElementById('search-input');

    const filterAccommodations = () => {
      const typeFilterValue = typeFilter.value.toLowerCase();
      const locationFilterValue = locationFilter.value.toLowerCase();
      const searchValue = searchInput.value.toLowerCase();

      let visibleCount = 0;

      document.querySelectorAll('.accommodation-card').forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const location = card.querySelector('.card-location').textContent.toLowerCase();
        const type = card.querySelector('.card-type').textContent.toLowerCase();
        
        const matchesType = !typeFilterValue || type.includes(typeFilterValue);
        const matchesLocation = !locationFilterValue || location.includes(locationFilterValue);
        const matchesSearch = !searchValue || title.includes(searchValue);

        if (matchesType && matchesLocation && matchesSearch) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      document.getElementById('results-count').textContent = `${visibleCount} accommodations found`;
      
      const noResults = document.getElementById('no-results');
      if (visibleCount === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
    };

    typeFilter.addEventListener('change', filterAccommodations);
    locationFilter.addEventListener('change', filterAccommodations);
    searchInput.addEventListener('input', filterAccommodations);

    // View details button
    document.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        window.location.hash = `#/accommodation/${id}`;
      });
    });
  }
}



