/** Product listing page — add-to-cart helpers */
const productWeights = {
  'moringa-powder': 100,
  'curry-leaves': 30,
  'black-tea': 100,
  'moringa-soap': 95,
  'combo-pack': 130,
  'gift-pack': 325,
  'moringa-400g': 400,
  'moringa-200g': 200,
  'moringa-soap-combo': 195,
};

function addProductToCart(id, name, price, image) {
  if (window.Cart && window.Cart.add) {
    const weight = productWeights[id] || 100;
    window.Cart.add({
      id,
      name,
      price,
      image,
      weight,
      quantity: 1,
    });
  }
}

window.addProductToCart = addProductToCart;
