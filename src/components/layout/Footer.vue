<template>
  <footer class="bg-gray-900 text-white">
    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="bg-blue-600 text-white rounded-lg p-2 mr-3">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <span class="text-xl font-bold">E-Mall</span>
          </div>
          <p class="text-gray-300">
            Your ultimate shopping destination for electronics, fashion, home goods, and more. 
            We provide quality products at competitive prices with excellent customer service.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.017 0C18.396 0 22.74 4.344 22.74 10.723c0 5.498-3.866 10.089-9.026 11.146v-7.88h2.464l.467-3.04h-2.931V8.688c0-.836.41-1.651 1.722-1.651h1.327V4.416s-1.204-.206-2.357-.206c-2.405 0-3.977 1.457-3.977 4.092v2.347h-2.67v3.04h2.67v7.88C3.866 20.812 0 16.221 0 10.723 0 4.344 4.344.001 10.723.001h1.294z" clip-rule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Customer Service -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Customer Service</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Shipping Info</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Size Guide</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Track Your Order</a></li>
          </ul>
        </div>

        <!-- Company -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Company</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Press</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Affiliate Program</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Sustainability</a></li>
          </ul>
        </div>

        <!-- Newsletter & Contact -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Stay Connected</h3>
          <p class="text-gray-300">Subscribe to get special offers, free giveaways, and updates.</p>
          <form @submit.prevent="subscribeNewsletter" class="space-y-3">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
          <div class="space-y-2 text-sm text-gray-300">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              1-800-E-MALL-24
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              support@emall.com
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment & Security -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <!-- Payment Methods -->
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-400">We Accept:</span>
            <div class="flex items-center space-x-2">
              <div class="bg-white rounded px-2 py-1">
                <span class="text-blue-600 font-bold text-sm">VISA</span>
              </div>
              <div class="bg-white rounded px-2 py-1">
                <span class="text-red-600 font-bold text-sm">MC</span>
              </div>
              <div class="bg-white rounded px-2 py-1">
                <span class="text-blue-800 font-bold text-sm">AMEX</span>
              </div>
              <div class="bg-white rounded px-2 py-1">
                <span class="text-blue-600 font-bold text-sm">PayPal</span>
              </div>
            </div>
          </div>

          <!-- Security Badges -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center text-green-400">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm">SSL Secured</span>
            </div>
            <div class="flex items-center text-green-400">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              <span class="text-sm">Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p class="text-sm text-gray-400">
            © 2024 E-Mall. All rights reserved.
          </p>
          <!-- Legal Links -->
          <div class="flex items-center space-x-6 text-sm">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

const subscribeNewsletter = () => {
  if (email.value) {
    // Mock newsletter subscription
    alert('Thank you for subscribing to our newsletter!')
    email.value = ''
  }
}
</script>