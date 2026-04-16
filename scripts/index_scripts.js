const suggestions = [
  // These are just the categories on the Craigslist home page,
  // with some car stuff hard-coded in so our dummy search
  // results work - Zach

  // Community
  "Activities", "Artists", "Childcare", "Classes", "Events",
  "General", "Groups", "Local news", "Lost+found", "Missed connections",
  "Musicians", "Pets", "Politics", "Rants & raves", "Rideshare", "Volunteers",

  // Services
  "Automotive", "Beauty", "Cell/mobile", "Computer", "Creative",
  "Cycle", "Event", "Farm+garden", "Financial", "Health/well",
  "Household", "Labor/move", "Legal", "Lessons", "Marine",
  "Pet", "Real estate", "Skilled trade", "Sm biz ads", "Travel/vac",
  "Write/ed/tran",

  // Forums
  "Apple", "Arts", "Atheist", "Autos", "Bikes", "Celebs", "Comp",
  "Cosmos", "Diet", "Divorce", "Dying", "Eco", "Film", "Fixit",
  "Food", "Frugal", "Gaming", "Garden", "Haiku", "History",
  "Housing", "Jobs", "Jokes", "Manners", "Marriage", "Money",
  "Music", "Open", "Parent", "Philos", "Photo", "Psych",
  "Recover", "Religion", "Science", "Spirit", "Sports", "Tax",
  "Travel", "TV", "Vegan", "Words", "Writing",

  // Housing
  "Apts / housing", "Housing swap", "Housing wanted", "Office / commercial",
  "Parking / storage", "Real estate for sale", "Rooms / shared",
  "Rooms wanted", "Sublets / temporary", "Vacation rentals",

  // For Sale
  "Antiques", "Appliances", "Arts+crafts", "ATV/UTV/sno", "Auto parts",
  "Aviation", "Baby+kid", "Barter", "Beauty+hlth", "Bike parts",
  "Boat parts", "Boats", "Books", "Business", "Cars+trucks",
  "CDs/DVD/VHS", "Cell phones", "Clothes+acc", "Collectibles",
  "Computer parts", "Computers", "Electronics", "Farm+garden",
  "Free", "Furniture", "Garage sale", "Heavy equip", "Jewelry",
  "Materials", "Motorcycle parts", "Motorcycles", "Music instr",
  "Photo+video", "RVs+camp", "Sporting", "Tickets", "Tools",
  "Toys+games", "Trailers", "Video gaming", "Wanted", "Wheels+tires",

  // Jobs
  "Accounting+finance", "Admin / office", "Arch / engineering",
  "Art / media / design", "Biotech / science", "Business / mgmt",
  "Customer service", "Education", "Food / bev / hosp", "General labor",
  "Government", "Human resources", "Legal / paralegal", "Manufacturing",
  "Marketing / pr / ad", "Medical / health", "Nonprofit sector",
  "Retail / wholesale", "Sales / biz dev", "Salon / spa / fitness",
  "Security", "Skilled trade / craft", "Software / qa / dba",
  "Systems / network", "Technical support", "Transport",
  "TV / film / video", "Web / info design", "Writing / editing",

  // Gigs
  "Crew", "Domestic", "Talent",

  // Used Claude to generate many various search terms for
  // car things - Zach

  // Car makes
  "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley",
  "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
  "Dodge", "Ferrari", "Fiat", "Ford", "Genesis",
  "GMC", "Honda", "Hummer", "Hyundai", "Infiniti",
  "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover",
  "Lexus", "Lincoln", "Lotus", "Maserati", "Mazda",
  "McLaren", "Mercedes", "Mercury", "Mini", "Mitsubishi",
  "Nissan", "Oldsmobile", "Pontiac", "Porsche", "Ram",
  "Rolls-Royce", "Saab", "Saturn", "Scion", "Subaru",
  "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",

  // Model types
  "Sedan", "SUV", "Truck", "Pickup", "Minivan", "Convertible",
  "Coupe", "Hatchback", "Wagon", "Hybrid", "Electric",
  "Crossover", "Muscle car", "Sports car", "Luxury car",
  "Off-road", "4x4", "AWD", "4WD", "Diesel",
  "Plug-in hybrid", "Van", "Cargo van", "Panel van",
  "Compact", "Midsize", "Full-size", "Subcompact",
  "Supercar", "Roadster", "Hardtop", "Fastback", "Liftback",
  "Cab", "Extended cab", "Crew cab", "Long bed", "Short bed",

  // Random
  "Sedan", "SUV", "Truck", "Pickup", "Minivan", "Convertible",
  "Coupe", "Hatchback", "Wagon", "Hybrid", "Electric",
  "Under $5,000", "Under $10,000", "Under $20,000",
  "Low mileage", "One owner", "Clean title", "No accidents",
  "Apartments", "Rooms for rent", "Cleaning", "Moving help",
  "Bicycles", "Musical instruments", "Sporting goods",
];

  const input = document.getElementById('basic_search');
  const list = document.getElementById('suggestionsList');

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    list.innerHTML = '';

    if (!query) return;

    const matches = suggestions.filter(s =>
      s.toLowerCase().includes(query)
    ).slice(0, 6);

    if (matches.length === 0) {
      const li = document.createElement('li');
      li.className = 'suggestion-no-results';
      li.textContent = 'No suggestions found';
      list.appendChild(li);
      return;
    }

    matches.forEach(match => {
      const li = document.createElement('li');
      // Bold the matching portion
      const idx = match.toLowerCase().indexOf(query);
      li.innerHTML =
        match.slice(0, idx) +
        '<strong>' + match.slice(idx, idx + query.length) + '</strong>' +
        match.slice(idx + query.length);
      li.addEventListener('mousedown', () => {
        input.value = match;
        list.innerHTML = '';
      });
      list.appendChild(li);
    });
  });

  input.addEventListener('blur', () => {
    setTimeout(() => list.innerHTML = '', 150);
    document.getElementById('searchBarWrapper').classList.remove('focused');
  });

  input.addEventListener('focus', () => {
    document.getElementById('searchBarWrapper').classList.add('focused');
  });

  function submitSearch() {
    const query = input.value.trim();
    const dest = query
      ? 'search.html?q=' + encodeURIComponent(query)
      : 'search.html';

    // Show the loader overlay, then navigate after 700 ms
    const loader = document.getElementById('search-loader');
    loader.classList.add('active');
    setTimeout(() => { window.location.href = dest; }, 700);
  }

//Turns off fade in animation for card so cool tilt effect works -->

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('animationend', () => {
    card.style.animation = 'none';
    card.style.opacity = '1';
  });
});


//Cool card effect -->
  document.querySelectorAll('.card, .search-card, .search-card-link').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Normalize -1 to 1 from center
      const tiltX = ((y - cy) / cy) * -10;  // up/down tilt
      const tiltY = ((x - cx) / cx) * 10;   // left/right tilt

      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(12px) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  //Active dots
const wrapper = document.querySelector('.cards-wrapper');
const cards = document.querySelectorAll('.card');
const dots = document.querySelectorAll('.dot');

wrapper.addEventListener('scroll', () => {
  const scrollLeft = wrapper.scrollLeft;
  const cardWidth = cards[0].offsetWidth + 16; // 16 = gap
  const active = Math.round(scrollLeft / cardWidth);

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === active);
  });
});