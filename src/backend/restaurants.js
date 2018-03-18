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
}, {
  label: '4 Alternatywy'
}, {
  label: 'Rico\'s kitchen'
}, {
  label: 'Bazar'
}, {
  label: 'Meat us'
}, {
  label: 'Zdolni'
}, {
  label: 'Baraboo'
}, {
  label: 'Piwnica'
}];

restaurants.forEach((restaurant, index) => {
  restaurant.id = index + 1;
});

module.exports = restaurants.sort((r1, r2) => r1.label.localeCompare(r2.label));
