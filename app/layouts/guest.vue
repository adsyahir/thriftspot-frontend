<script setup lang="ts">
import { PackageIcon, ShirtIcon, LaptopIcon, HomeIcon, SparklesIcon, MapPinIcon, UserIcon, LogInIcon } from 'lucide-vue-next'
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
  { name: 'Electronics', icon: LaptopIcon, href: '/browse?category=electronics' },
  { name: 'Fashion', icon: ShirtIcon, href: '/browse?category=fashion' },
  { name: 'Home & Living', icon: HomeIcon, href: '/browse?category=home' },
  { name: 'Sports', icon: PackageIcon, href: '/browse?category=sports' },
]

const locations = [
  { name: 'Kuala Lumpur', state: 'kuala_lumpur' },
  { name: 'Selangor', state: 'selangor' },
  { name: 'Penang', state: 'penang' },
  { name: 'Johor', state: 'johor' },
  { name: 'Melaka', state: 'melaka' },
  { name: 'Perak', state: 'perak' },
]

const year = new Date().getFullYear()
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-gray-200">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2">
            <SparklesIcon class="w-8 h-8 text-gray-900" />
            <span class="text-2xl font-bold text-gray-900">ThriftSpot</span>
          </NuxtLink>

          <div class="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
                    <NuxtLink to="/browse" class="text-gray-700 hover:text-gray-900">Browse</NuxtLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>

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
                              <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
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
                      <li v-for="location in locations" :key="location.state">
                        <NavigationMenuLink as-child>
                          <NuxtLink
                            :to="`/browse?state=${location.state}`"
                            class="flex items-center gap-2 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <MapPinIcon class="w-4 h-4 text-gray-600" />
                            <div class="text-sm font-medium text-gray-900">{{ location.name }}</div>
                          </NuxtLink>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
                    <NuxtLink to="/shops" class="text-gray-700 hover:text-gray-900">Shops</NuxtLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
                    <NuxtLink to="/about" class="text-gray-700 hover:text-gray-900">About</NuxtLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink to="/auth/signup">
              <Button variant="outline" size="sm">
                <UserIcon class="w-4 h-4 mr-2" />
                Sell Items
              </Button>
            </NuxtLink>
            <NuxtLink to="/auth/signin">
              <Button variant="ghost" size="sm">
                <LogInIcon class="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </NuxtLink>
            <NuxtLink to="/auth/signup">
              <Button size="sm">Sign Up</Button>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <slot />

    <footer class="border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ul class="flex flex-wrap gap-6 text-sm text-gray-600">
          <li><NuxtLink to="/browse" class="hover:text-gray-900">Browse</NuxtLink></li>
          <li><NuxtLink to="/shops" class="hover:text-gray-900">Shops</NuxtLink></li>
          <li><NuxtLink to="/about" class="hover:text-gray-900">About</NuxtLink></li>
        </ul>
        <p class="mt-6 text-sm text-gray-600">&copy; {{ year }} ThriftSpot. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
