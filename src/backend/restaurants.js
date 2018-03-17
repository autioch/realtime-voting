const restaurants = [{
  label: 'Labija'
}, {
  label: 'Chińczyk'
}, {
  label: 'Kura warzyw'
}, {
  label: 'Gołe baby'
}, {
  label: 'McDonald'
}, {
  label: 'Foodie'
}];

restaurants.forEach((restaurant, index) => {
  restaurant.id = index + 1;
});

module.exports = restaurants;
