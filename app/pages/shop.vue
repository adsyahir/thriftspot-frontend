<script setup lang="ts">
import { ref } from 'vue'
import { Store, MapPin, Phone, Mail, Clock, Image, Plus, Edit, Trash2 } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { ShopRequest } from '@/types/shop'

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const isDialogOpen = ref(false)

const form = ref<ShopRequest>({
  name: '',
  description: '',
  location_type: 'google_maps',
  place_id: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  phone_number: '',
  email: '',
  social_links: {
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
    whatsapp: ''
  },
  operating_hours: {
    monday: ['', ''],
    tuesday: ['', ''],
    wednesday: ['', ''],
    thursday: ['', ''],
    friday: ['', ''],
    saturday: ['', ''],
    sunday: ['', '']
  }
});


const submitForm = () => {
  console.log(form.value);
}

const isClosed = (day: keyof typeof form.value.operating_hours) => {
  return form.value.operating_hours[day] === false
}

const toggleClosed = (day: keyof typeof form.value.operating_hours, event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    form.value.operating_hours[day] = false
  } else {
    form.value.operating_hours[day] = ['', '']
  }
}
</script>

<template>
  <div class="max-w-6xl">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Shop Management</h1>
        <p class="text-gray-600 mt-2">Manage all your shops in one place.</p>
      </div>

      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Plus class="w-5 h-5" />
            Add Shop
          </button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add New Shop</DialogTitle>
            <DialogDescription>
              Fill in the information below to create a new shop listing.
            </DialogDescription>
          </DialogHeader>

          <div class="overflow-y-auto flex-1 mt-4 pr-2">
            <form class="space-y-6">
              <!-- Shop Logo/Image -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <Image class="inline-block w-4 h-4 mr-1" />
                  Shop Logo
                </label>
                <div class="flex items-center gap-4">
                  <div class="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Image class="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Upload Image
                    </button>
                    <p class="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max. 2MB)</p>
                  </div>
                </div>
              </div>

              <!-- Shop Name -->
              <div>
                <label for="shop-name" class="block text-sm font-medium text-gray-700 mb-2">
                  <Store class="inline-block w-4 h-4 mr-1" />
                  Shop Name *
                </label>
                <input
                  id="shop-name"
                  v-model="form.name"
                  type="text"
                  placeholder="Enter your shop name"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="4"
                  placeholder="Tell customers about your shop..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">Brief description of your thrift shop</p>
              </div>

              <!-- Location Section -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  <MapPin class="inline-block w-5 h-5 mr-2" />
                  Location *
                </h3>

                <div class="space-y-6">
                  <!-- Google Maps Option -->
                  <div class="flex items-start gap-3">
                    <input
                      id="location-google"
                      type="radio"
                      v-model="form.location_type"
                      value="google_maps"
                      class="mt-1 w-4 h-4 text-blue-600 border-gray-300"
                    />
                    <div class="flex-1">
                      <label for="location-google" class="block font-medium text-gray-900 mb-1 cursor-pointer">
                        Available on Google Maps
                      </label>
                      <p class="text-sm text-gray-500 mb-3">
                        For business that we can search on Google Maps.<br>
                        Just search for the business name to submit the place. Please make sure it's the same business.
                      </p>

                      <div v-if="form.location_type === 'google_maps'" class="mt-3">
                        <!-- Google Maps Placeholder -->
                        <div class="w-full h-64 bg-gray-100 rounded-md border-2 border-gray-300 flex items-center justify-center">
                          <div class="text-center text-gray-500">
                            <MapPin class="w-12 h-12 mx-auto mb-2" />
                            <p class="text-sm">Google Maps integration will be implemented here</p>
                            <p class="text-xs mt-1">Search for your business location</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Coordinates Option -->
                  <div class="flex items-start gap-3">
                    <input
                      id="location-coordinates"
                      type="radio"
                      v-model="form.location_type"
                      value="coordinates"
                      class="mt-1 w-4 h-4 text-blue-600 border-gray-300"
                    />
                    <div class="flex-1">
                      <label for="location-coordinates" class="block font-medium text-gray-900 mb-1 cursor-pointer">
                        Only coordinate (latitude and longitude)
                      </label>
                      <p class="text-sm text-gray-500 mb-3">
                        For mobile business / not registered with Google.<br>
                        Search for the nearest place to zoom in faster and then drag the marker to the exact location.
                      </p>

                      <div v-if="form.location_type === 'coordinates'" class="mt-3">
                        <!-- Google Maps Placeholder for Coordinates -->
                        <div class="w-full h-64 bg-gray-100 rounded-md border-2 border-gray-300 flex items-center justify-center">
                          <div class="text-center text-gray-500">
                            <MapPin class="w-12 h-12 mx-auto mb-2" />
                            <p class="text-sm">Google Maps integration will be implemented here</p>
                            <p class="text-xs mt-1">Drag the marker to set location</p>
                          </div>
                        </div>

                        <!-- Coordinate Display -->
                        <div class="mt-3 grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                            <input
                              v-model.number="form.latitude"
                              type="number"
                              step="any"
                              placeholder="0.0000"
                              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                            <input
                              v-model.number="form.longitude"
                              type="number"
                              step="any"
                              placeholder="0.0000"
                              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                      <Phone class="inline-block w-4 h-4 mr-1" />
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone_number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      <Mail class="inline-block w-4 h-4 mr-1" />
                      Email Address *
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      placeholder="shop@example.com"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Social Media Links -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>

                <div class="space-y-4">
                  <!-- Instagram -->
                  <div>
                    <label for="instagram" class="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <div class="flex items-center">
                      <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        instagram.com/
                      </span>
                      <input
                        id="instagram"
                        v-model="form.social_links!.instagram"
                        type="text"
                        placeholder="username"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <!-- Facebook -->
                  <div>
                    <label for="facebook" class="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <div class="flex items-center">
                      <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        facebook.com/
                      </span>
                      <input
                        id="facebook"
                        v-model="form.social_links!.facebook"
                        type="text"
                        placeholder="username"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <!-- Twitter -->
                  <div>
                    <label for="twitter" class="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <div class="flex items-center">
                      <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        twitter.com/
                      </span>
                      <input
                        id="twitter"
                        v-model="form.social_links!.twitter"
                        type="text"
                        placeholder="username"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <!-- TikTok -->
                  <div>
                    <label for="tiktok" class="block text-sm font-medium text-gray-700 mb-2">
                      TikTok
                    </label>
                    <div class="flex items-center">
                      <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        tiktok.com/
                      </span>
                      <input
                        id="tiktok"
                        v-model="form.social_links!.tiktok"
                        type="text"
                        placeholder="@username"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <!-- WhatsApp -->
                  <div>
                    <label for="whatsapp" class="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp
                    </label>
                    <input
                      id="whatsapp"
                      v-model="form.social_links!.whatsapp"
                      type="tel"
                      placeholder="60123456789"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Operating Hours -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  <Clock class="inline-block w-5 h-5 mr-2" />
                  Operating Hours
                </h3>

                <div class="space-y-3">
                  <!-- Monday -->
                  <div class="flex items-center gap-4">
                    <div class="w-24">
                      <label class="text-sm font-medium text-gray-700">Monday</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="time"
                        v-model="(form.operating_hours.monday as string[])[0]"
                        :disabled="isClosed('monday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <span class="text-gray-500">to</span>
                      <input
                        type="time"
                        v-model="(form.operating_hours.monday as string[])[1]"
                        :disabled="isClosed('monday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <label class="flex items-center gap-2 ml-2">
                        <input
                          type="checkbox"
                          :checked="isClosed('monday')"
                          @change="toggleClosed('monday', $event)"
                          class="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span class="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                  </div>

                  <!-- Tuesday -->
                  <div class="flex items-center gap-4">
                    <div class="w-24">
                      <label class="text-sm font-medium text-gray-700">Tuesday</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="time"
                        v-model="(form.operating_hours.tuesday as string[])[0]"
                        :disabled="isClosed('tuesday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <span class="text-gray-500">to</span>
                      <input
                        type="time"
                        v-model="(form.operating_hours.tuesday as string[])[1]"
                        :disabled="isClosed('tuesday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <label class="flex items-center gap-2 ml-2">
                        <input
                          type="checkbox"
                          :checked="isClosed('tuesday')"
                          @change="toggleClosed('tuesday', $event)"
                          class="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span class="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                  </div>

                  <!-- Wednesday -->
                  <div class="flex items-center gap-4">
                    <div class="w-24">
                      <label class="text-sm font-medium text-gray-700">Wednesday</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="time"
                        v-model="(form.operating_hours.wednesday as string[])[0]"
                        :disabled="isClosed('wednesday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <span class="text-gray-500">to</span>
                      <input
                        type="time"
                        v-model="(form.operating_hours.wednesday as string[])[1]"
                        :disabled="isClosed('wednesday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <label class="flex items-center gap-2 ml-2">
                        <input
                          type="checkbox"
                          :checked="isClosed('wednesday')"
                          @change="toggleClosed('wednesday', $event)"
                          class="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span class="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                  </div>

                  <!-- Thursday -->
                  <div class="flex items-center gap-4">
                    <div class="w-24">
                      <label class="text-sm font-medium text-gray-700">Thursday</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="time"
                        v-model="(form.operating_hours.thursday as string[])[0]"
                        :disabled="isClosed('thursday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <span class="text-gray-500">to</span>
                      <input
                        type="time"
                        v-model="(form.operating_hours.thursday as string[])[1]"
                        :disabled="isClosed('thursday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <label class="flex items-center gap-2 ml-2">
                        <input
                          type="checkbox"
                          :checked="isClosed('thursday')"
                          @change="toggleClosed('thursday', $event)"
                          class="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span class="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                  </div>

                  <!-- Friday -->
                  <div class="flex items-center gap-4">
                    <div class="w-24">
                      <label class="text-sm font-medium text-gray-700">Friday</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="time"
                        v-model="(form.operating_hours.friday as string[])[0]"
                        :disabled="isClosed('friday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <span class="text-gray-500">to</span>
                      <input
                        type="time"
                        v-model="(form.operating_hours.friday as string[])[1]"
                        :disabled="isClosed('friday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <label class="flex items-center gap-2 ml-2">
                        <input
                          type="checkbox"
                          :checked="isClosed('friday')"
                          @change="toggleClosed('friday', $event)"
                          class="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span class="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                  </div>

                  <!-- Saturday -->
                  <div class="flex items-center gap-4">
                    <div class="w-24">
                      <label class="text-sm font-medium text-gray-700">Saturday</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="time"
                        v-model="(form.operating_hours.saturday as string[])[0]"
                        :disabled="isClosed('saturday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <span class="text-gray-500">to</span>
                      <input
                        type="time"
                        v-model="(form.operating_hours.saturday as string[])[1]"
                        :disabled="isClosed('saturday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <label class="flex items-center gap-2 ml-2">
                        <input
                          type="checkbox"
                          :checked="isClosed('saturday')"
                          @change="toggleClosed('saturday', $event)"
                          class="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span class="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                  </div>

                  <!-- Sunday -->
                  <div class="flex items-center gap-4">
                    <div class="w-24">
                      <label class="text-sm font-medium text-gray-700">Sunday</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="time"
                        v-model="(form.operating_hours.sunday as string[])[0]"
                        :disabled="isClosed('sunday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <span class="text-gray-500">to</span>
                      <input
                        type="time"
                        v-model="(form.operating_hours.sunday as string[])[1]"
                        :disabled="isClosed('sunday')"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <label class="flex items-center gap-2 ml-2">
                        <input
                          type="checkbox"
                          :checked="isClosed('sunday')"
                          @change="toggleClosed('sunday', $event)"
                          class="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span class="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <DialogFooter class="mt-4 flex-shrink-0">
            <button
              type="button"
              @click="isDialogOpen = false"
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="submitForm"
              type="submit"
              class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Shops Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shop Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <!-- Sample Row 1 (Replace with actual data) -->
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <Store class="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">Downtown Thrift</div>
                  <div class="text-sm text-gray-500">Est. 2020</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">123 Main St</div>
              <div class="text-sm text-gray-500">New York, NY 10001</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">+1 (555) 123-4567</div>
              <div class="text-sm text-gray-500">shop@example.com</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-blue-600 hover:text-blue-900 mr-3">
                <Edit class="w-4 h-4" />
              </button>
              <button class="text-red-600 hover:text-red-900">
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>

          <!-- Sample Row 2 (Replace with actual data) -->
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <Store class="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">Vintage Finds</div>
                  <div class="text-sm text-gray-500">Est. 2022</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">456 Oak Ave</div>
              <div class="text-sm text-gray-500">Brooklyn, NY 11201</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">+1 (555) 987-6543</div>
              <div class="text-sm text-gray-500">vintage@example.com</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-blue-600 hover:text-blue-900 mr-3">
                <Edit class="w-4 h-4" />
              </button>
              <button class="text-red-600 hover:text-red-900">
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>

          <!-- Empty State (Show when no shops) -->
          <!-- <tr>
            <td colspan="5" class="px-6 py-12 text-center">
              <Store class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 mb-4">No shops yet</p>
              <button
                @click="isDialogOpen = true"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus class="w-4 h-4" />
                Add Your First Shop
              </button>
            </td>
          </tr> -->
        </tbody>
      </table>
    </div>
  </div>
</template>
