"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin, Clock, Mail, ShoppingBag } from "lucide-react"

interface PickupLocation {
  id: number
  name: string
  address: string
  distance: string
  hours: string
  isAvailable: boolean
}

const pickupLocations: PickupLocation[] = [
  {
    id: 2364,
    name: "Shell by Linden",
    address: "648, DUNEARN ROAD, Singapore",
    distance: "0.98km",
    hours: "Open Mon-Sun 09:00-21:00",
    isAvailable: false,
  },
  {
    id: 4698,
    name: "Hardware City",
    address: "10 SIXTH AVENUE Singapore",
    distance: "1.41km",
    hours: "Open Mon-Sat 08:30-17:30 Sun 08:30-17:00",
    isAvailable: false,
  }
]

export default function ShopeePickupChecker() {
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")

  const handleEmailNotification = () => {
    if (!selectedLocation) {
      alert("Please select a pickup location first!")
      return
    }

    const location = pickupLocations.find((loc) => loc.id === selectedLocation)
    if (location) {
      // Here you would integrate with your email service
      alert(`Email notification set up for ${location.name}! You'll be notified when it becomes available.`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://wallpapers.com/images/high/pastel-orange-flower-nice-desktop-j6lqopu619oc2kd3.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Header */}
      <header className="relative z-10 text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          <h1 className="text-4xl font-bold text-gray-800">Megan</h1>
          <div className="bg-orange-500 p-2 rounded-lg">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <span className="text-orange-500 text-2xl font-semibold">Shopee</span>
          <h1 className="text-4xl font-bold text-gray-800">Pickup Check</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 justify-center flex flex-col items-center">
          {/* Location Details Panel */}
          <Card className="w-full max-w-md md:max-w-3xl shadow-lg rounded-lg bg-white">
            <CardContent className="flex flex-col p-6 md:p-10">
              <div className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
                  Collect from points near your address: 43 LINDEN DRIVE, #43, 288732
                </h2>

                <RadioGroup value={selectedLocation} onValueChange={setSelectedLocation}>
                  <div className="space-y-6">
                    {pickupLocations.map((location) => (
                      <div
                        key={location.id}
                        className="border rounded-lg p-5 md:p-7 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <RadioGroupItem value={location.id} id={location.id} className="mt-2" />
                          <div className="flex-1">
                            <Label htmlFor={location.id} className="cursor-pointer">
                              <div className="flex items-center gap-3 mb-3">
                                <div
                                  className={`w-4 h-4 rounded-full ${
                                    location.isAvailable ? "bg-green-500" : "bg-red-500"
                                  }`}
                                />
                                <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                                  {location.name}
                                </h3>
                                <span className="text-sm text-gray-500">{location.distance}</span>
                              </div>

                              <div className="text-gray-700 text-sm md:text-base leading-relaxed mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <MapPin className="w-5 h-5" />
                                  <span>{location.address}</span>
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="w-5 h-5" />
                                  <span>{location.hours}</span>
                                </div>
                              </div>

                              <div>
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                    location.isAvailable
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {location.isAvailable ? "Available" : "Unavailable"}
                                </span>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <Label htmlFor="email" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                  Email for notifications:
                </Label>
                <input
                  type="email"
                  id="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              {/* Email Button */}
              <div className="mt-auto">
                <Button
                  onClick={handleEmailNotification}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-semibold"
                  size="lg"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Me!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
