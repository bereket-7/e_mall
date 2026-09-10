import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    brand: 'E-Mall',
    shopNow: 'Shop Now',
    learnMore: 'Learn More',
    searchPlaceholder: 'Search for products, brands, and more...',
    cart: 'Cart',
    wishlist: 'Wishlist',
    freeShipping: 'Free shipping on orders over $50'
  },
  es: {
    brand: 'E-Mall',
    shopNow: 'Comprar ahora',
    learnMore: 'Saber más',
    searchPlaceholder: 'Buscar productos, marcas y más...',
    cart: 'Carrito',
    wishlist: 'Lista de deseos',
    freeShipping: 'Envío gratis en pedidos superiores a $50'
  },
  fr: {
    brand: 'E-Mall',
    shopNow: 'Acheter',
    learnMore: 'En savoir plus',
    searchPlaceholder: 'Rechercher des produits, marques...',
    cart: 'Panier',
    wishlist: 'Liste de souhaits',
    freeShipping: 'Livraison gratuite dès 50 $'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
