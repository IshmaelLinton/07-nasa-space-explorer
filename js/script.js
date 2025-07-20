// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Helper function to generate a random date
function getRandomDate() {
  // Generate a date in the last 10 years
  const start = new Date();
  start.setFullYear(start.getFullYear() - 10);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

// Helper function to generate a random title
function getRandomTitle() {
  const titles = [
    'Galactic Nebula',
    'Cosmic Dawn',
    'Stellar Nursery',
    'Lunar Landscape',
    'Martian Sunset',
    'Jupiter Storm',
    'Saturn Rings',
    'Solar Flare',
    'Comet Trail',
    'Asteroid Belt'
  ];
  // Pick a random title
  return titles[Math.floor(Math.random() * titles.length)];
}

// Helper function to get one of the 6 large images
function getTestImageUrl(index) {
  // List of 6 large images in the img/ folder
  const images = [
    'img/ant.png',
    'img/atlas.png',
    'img/chasm.png',
    'img/moon.png',
    'img/neb.png',
    'img/rose.png'
  ];
  // Use modulo to cycle through images if more than 6 cards
  return images[index % images.length];
}

// Helper function to generate a random description
function getRandomDescription() {
  const descriptions = [
    'A breathtaking view of the cosmos, captured by NASA.',
    'This image showcases the beauty and mystery of space.',
    'A stunning celestial event observed from Earth.',
    'An incredible formation of stars and dust.',
    'A rare glimpse into the wonders of our universe.',
    'A vibrant display of colors and cosmic phenomena.',
    'A peaceful moment in the vast expanse of space.',
    'A close-up of a distant planet or moon.',
    'A spectacular view of a nebula in deep space.',
    'A fascinating look at the surface of Mars.'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Helper function to fetch NASA APOD images for a date range
function fetchNasaImages(startDate, endDate) {
  const apiKey = 'Q5Qg1aNBcpw0WVfwR1flW3kcaqXM4UWXQsL0tpbl'; // Replace with your own key if needed
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from the API
  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Only keep images (ignore videos)
      return data.filter(item => item.media_type === 'image').map(item => ({
        url: item.url,
        hdurl: item.hdurl,
        date: item.date,
        title: item.title,
        explanation: item.explanation
      }));
    });
}

// Show modal with image, title, date, description
function showModal(imageUrl, title, date, description) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalImageArea = document.getElementById('modalImageArea');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalDescription = document.getElementById('modalDescription');
  const modal = modalOverlay.querySelector('.modal');

  // Set modal content
  modalImageArea.innerHTML = '';
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = title;
  modalImageArea.appendChild(img);
  modalTitle.textContent = title;
  modalDate.textContent = date;
  modalDescription.textContent = description;

  // Wait for image to load, then size modal to image
  img.onload = function() {
    // Get image size
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    // Get viewport size
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    // Calculate modal size so it's always larger than the image
    let modalWidth = Math.min(imgWidth + 120, vw * 0.90); // 120px extra padding
    let modalHeight = Math.min(imgHeight + 220, vh * 0.90); // 220px extra padding for info area
    modal.style.width = modalWidth + 'px';
    modal.style.height = modalHeight + 'px';
    modal.style.maxWidth = vw * 0.98 + 'px';
    modal.style.maxHeight = vh * 0.98 + 'px';
    // Center image in modal
    img.style.display = 'block';
    img.style.margin = '0 auto';
  };

  // Show modal
  modalOverlay.style.display = 'flex';
}

// Hide modal
function hideModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  modalOverlay.style.display = 'none';
}

// Add event listener to close button and overlay
const modalCloseBtn = document.getElementById('modalCloseBtn');
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', hideModal);
}
const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) hideModal();
  });
}

// Function to create and show image cards from API data
function showApiImageCards(images) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  images.forEach((item, idx) => {
    // Create card container
    const card = document.createElement('div');
    card.className = 'gallery-item pop-in';
    // Create image area
    const imageArea = document.createElement('div');
    imageArea.style.width = '100%';
    imageArea.style.height = '200px';
    imageArea.style.display = 'flex';
    imageArea.style.alignItems = 'center';
    imageArea.style.justifyContent = 'center';
    imageArea.style.background = '#222';
    imageArea.style.borderRadius = '4px';
    imageArea.style.position = 'relative';
    imageArea.style.overflow = 'hidden';
    // Create loading text
    const loadingText = document.createElement('span');
    loadingText.textContent = 'Loading image...';
    loadingText.style.color = '#fff';
    loadingText.style.fontSize = '1.1em';
    imageArea.appendChild(loadingText);
    // Create title and date
    const titleDiv = document.createElement('div');
    titleDiv.textContent = item.title;
    titleDiv.style.fontWeight = 'bold';
    titleDiv.style.color = '#212121';
    titleDiv.style.textAlign = 'center';
    titleDiv.style.marginTop = '10px';
    titleDiv.style.minHeight = '2em';
    const dateDiv = document.createElement('div');
    dateDiv.textContent = item.date;
    dateDiv.style.color = '#666';
    dateDiv.style.textAlign = 'center';
    dateDiv.style.marginTop = '4px';
    dateDiv.style.fontSize = '0.95em';
    // Add image area, title, and date to card
    card.appendChild(imageArea);
    card.appendChild(titleDiv);
    card.appendChild(dateDiv);
    // Simulate image loading
    setTimeout(() => {
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.title;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '4px';
      imageArea.innerHTML = '';
      imageArea.appendChild(img);
      // Add click event to show modal
      card.addEventListener('click', function() {
        showModal(item.hdurl || item.url, item.title, item.date, item.explanation);
      });
    }, 1000 + Math.random() * 1500);
    gallery.appendChild(card);
  });
}

// Hide gallery until images are loaded
const gallery = document.getElementById('gallery');
gallery.style.display = 'none';

// Add event listener to the button to fetch images after date range input
const getImagesBtn = document.querySelector('.filters button');
getImagesBtn.addEventListener('click', () => {
  const startInput = document.getElementById('startDate');
  const endInput = document.getElementById('endDate');
  const startDate = startInput.value;
  const endDate = endInput.value;
  // Validate dates (simple check)
  if (!startDate || !endDate) {
    alert('Please select a valid date range.');
    return;
  }
  // Hide gallery while loading
  gallery.style.display = 'none';
  // Fetch images from API
  fetchNasaImages(startDate, endDate)
    .then(images => {
      if (images.length === 0) {
        gallery.innerHTML = '<div class="placeholder"><p>No images found for this date range.</p></div>';
      } else {
        showApiImageCards(images);
      }
      gallery.style.display = 'flex';
    })
    .catch(error => {
      gallery.innerHTML = '<div class="placeholder"><p>Error fetching images.</p></div>';
      gallery.style.display = 'flex';
      console.error(error);
    });
});

// Remove placeholder/test cards on page load
const placeholder = document.querySelector('.placeholder');
if (placeholder) {
  placeholder.remove();
}
