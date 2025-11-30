<script setup lang="ts">
import { SearchIcon, PackageIcon, ShirtIcon, LaptopIcon, HomeIcon, SparklesIcon, MapPinIcon, UserIcon, LogInIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
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
          <NuxtLink to="/" class="flex items-center gap-2">
            <SparklesIcon class="w-8 h-8 text-gray-900" />
            <span class="text-2xl font-bold text-gray-900">ThriftSpot</span>
          </NuxtLink>

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
                          <NuxtLink
                            :to="category.href"
                            class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <div class="flex items-center gap-2">
                              <component :is="category.icon" class="w-5 h-5 text-gray-600" />
                              <div class="text-sm font-medium text-gray-900">
                                {{ category.name }}
                              </div>
                            </div>
                          </NuxtLink>
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
                    <NuxtLink to="/about" class="text-gray-700 hover:text-gray-900">
                      About
                    </NuxtLink>
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
            <NuxtLink to="/auth/signin">
              <Button variant="ghost" size="sm">
                <LogInIcon class="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </NuxtLink>
            <NuxtLink to="/auth/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Page Content -->
    <slot />

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
