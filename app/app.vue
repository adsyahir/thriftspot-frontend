<script setup lang="ts">
import { SearchIcon, PackageIcon, ShirtIcon, LaptopIcon, HomeIcon, SparklesIcon, MapPinIcon, UserIcon, LogInIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const categories = [
  { name: 'Electronics', icon: LaptopIcon, href: '/category/electronics' },
  { name: 'Fashion', icon: ShirtIcon, href: '/category/fashion' },
  { name: 'Home & Living', icon: HomeIcon, href: '/category/home' },
  { name: 'Sports', icon: PackageIcon, href: '/category/sports' },
]

const locations = [
  { name: 'Kuala Lumpur', region: 'Federal Territory' },
  { name: 'Selangor', region: 'Selangor' },
  { name: 'Penang', region: 'Penang' },
  { name: 'Johor', region: 'Johor' },
  { name: 'Melaka', region: 'Melaka' },
  { name: 'Perak', region: 'Perak' },
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-gray-200">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <SparklesIcon class="w-8 h-8 text-gray-900" />
            <span class="text-2xl font-bold text-gray-900">ThriftSpot</span>
          </div>

          <!-- Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger class="text-gray-700 hover:text-gray-900">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul class="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                      <li v-for="category in categories" :key="category.name">
                        <NavigationMenuLink as-child>
                          <a
                            :href="category.href"
                            class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <div class="flex items-center gap-2">
                              <component :is="category.icon" class="w-5 h-5 text-gray-600" />
                              <div class="text-sm font-medium text-gray-900">
                                {{ category.name }}
                              </div>
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger class="text-gray-700 hover:text-gray-900">
                    Locations
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul class="grid w-[300px] gap-2 p-4">
                      <li v-for="location in locations" :key="location.name">
                        <NavigationMenuLink as-child>
                          <a
                            href="#"
                            class="flex items-center gap-2 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <MapPinIcon class="w-4 h-4 text-gray-600" />
                            <div>
                              <div class="text-sm font-medium text-gray-900">{{ location.name }}</div>
                              <div class="text-xs text-gray-500">{{ location.region }}</div>
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
                    <a href="/about" class="text-gray-700 hover:text-gray-900">
                      About
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <UserIcon class="w-4 h-4 mr-2" />
              Sell Items
            </Button>
            <Button variant="ghost" size="sm">
              <LogInIcon class="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Discover Hidden Treasures
          <br />
          <span class="text-gray-600">At Thrift Shops Near You</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-600 mb-8">
          Browse thousands of thrift items from local shops and vendors across Malaysia
        </p>

        <!-- Search Bar -->
        <div class="relative max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search for items, categories, or locations..."
            class="h-14 pl-12 pr-4 text-lg rounded-full border-2 border-gray-200 focus:border-gray-400"
          />
          <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <a
          v-for="category in categories"
          :key="category.name"
          :href="category.href"
          class="group p-8 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
        >
          <component :is="category.icon" class="w-12 h-12 text-gray-700 mb-4 group-hover:scale-110 transition-transform" />
          <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
        </a>
      </div>
    </section>

    <!-- Featured Section -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Featured Items</h2>
          <Button variant="link" class="text-gray-600 hover:text-gray-900">
            View All →
          </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div class="aspect-square bg-gray-200" />
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1">Sample Item {{ i }}</h3>
              <p class="text-sm text-gray-600 mb-2">Kuala Lumpur</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-gray-900">RM 50</span>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-gray-900 rounded-3xl p-12 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Own a thrift shop or sell secondhand items?
        </h2>
        <p class="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join hundreds of vendors and promote your thrift shop to reach more customers on ThriftSpot
        </p>
        <Button size="lg" variant="secondary" class="text-lg px-8">
          Promote Your Shop
        </Button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">About</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">About Us</a></li>
              <li><a href="#" class="hover:text-gray-900">How It Works</a></li>
              <li><a href="#" class="hover:text-gray-900">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Support</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">Help Center</a></li>
              <li><a href="#" class="hover:text-gray-900">Safety</a></li>
              <li><a href="#" class="hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">Terms</a></li>
              <li><a href="#" class="hover:text-gray-900">Privacy</a></li>
              <li><a href="#" class="hover:text-gray-900">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Connect</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">Twitter</a></li>
              <li><a href="#" class="hover:text-gray-900">Instagram</a></li>
              <li><a href="#" class="hover:text-gray-900">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; 2025 ThriftSpot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
