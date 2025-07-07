"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin, Clock, Mail, ShoppingBag } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

// Dont worry Megan im not going to dox you
const MEGAN_ADDRESS = process.env.NEXT_PUBLIC_MEGAN_ADDRESS || ""

interface PickupLocation {
  id: string
  name: string
  address: string
  distance: string
  hours: string
  isAvailable: boolean
}

// Manually inserted cause its just megan and she is not getting a mongodb 
const initialPickupLocations: PickupLocation[] = [
  {
    id: process.env.NEXT_PUBLIC_PICKUP_LOCATION_0_ID || "",
    name: process.env.NEXT_PUBLIC_PICKUP_LOCATION_0_NAME || "Megan's Pickup Location",
    address: process.env.NEXT_PUBLIC_PICKUP_LOCATION_0_ADDRESS || "123 Megan Street, Singapore",
    distance: process.env.NEXT_PUBLIC_PICKUP_LOCATION_0_DISTANCE || "0.00km",
    hours: "Open Mon-Sun 09:00-21:00",
    isAvailable: false,
  },
  {
    id: process.env.NEXT_PUBLIC_PICKUP_LOCATION_1_ID || "",
    name: process.env.NEXT_PUBLIC_PICKUP_LOCATION_1_NAME || "Megan's Pickup Location",
    address: process.env.NEXT_PUBLIC_PICKUP_LOCATION_1_ADDRESS || "123 Megan Street, Singapore",
    distance: process.env.NEXT_PUBLIC_PICKUP_LOCATION_1_DISTANCE || "0.00km",
    hours: "Open Mon-Sat 08:30-17:30 Sun 08:30-17:00",
    isAvailable: false,
  }
]

export default function ShopeePickupChecker() {
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [wantsEmail, setWantsEmail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Move pickupLocations to state so we can update availability dynamically
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>(initialPickupLocations)

  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["fetchAvailability"],
    queryFn: async () => {
      console.log("Fetching availability for Megan")
      const res = await fetch("http://127.0.0.1:8000/fetchAvailability/Megan")
      console.log(res)
      if (!res.ok) throw new Error("Failed to fetch availability")
      return res.json()  // Expected to be array of { id: string, avail: boolean }
    },
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  })


  // Sync isLoading with isFetching
  useEffect(() => {
    setIsLoading(isFetching)
  }, [isFetching])

  useEffect(() => {
  if (!data || !Array.isArray(data)) return

  setPickupLocations((currentLocations) => {
    const updatedLocations = currentLocations.map((loc) => {
      const found = data.find((item: { id: string; avail: boolean }) => item.id === loc.id)
      if (found) {
        return { ...loc, isAvailable: found.avail }
      }
      return loc
    })

    // After updating availability, check if we should send email
    if (wantsEmail && updatedLocations.some(loc => loc.isAvailable)) {
      fetch("http://127.0.0.1:8000/emailMegan")
        .then(res => {
          if (!res.ok) throw new Error("Failed to send email")
          return res.text()
        })
        .then(() => console.log("Email request sent successfully"))
        .catch(console.error)
    }

    return updatedLocations
  })
}, [data, wantsEmail])

  if (error) return <div>Error loading</div>

  const handleRefresh = () => {
    console.log("Refreshing availability...")
    refetch()
  }

  const handleEmailNotification = () => {
    console.log("Send email to:", userEmail)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
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
        <Card className="w-full max-w-md md:max-w-3xl shadow-lg rounded-lg bg-white">
          <CardContent className="flex flex-col p-6 md:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-lg md:text-lg font-bold text-gray-700 mb-2">
                Collect from points near your address
              </h2>
              {/* Not dox megan today */}
              <h2 className="text-xl md:text-xl font-bold text-gray-800 mb-4 bg-orange-100 rounded-md px-3 py-1 inline-block">
                {`${MEGAN_ADDRESS || "Megan's Address"}`}
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
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded-full ${
                                      isLoading ? "bg-gray-300" :
                                      location.isAvailable ? "bg-green-500" : "bg-red-500"
                                    }`}
                                  />
                                  <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                                    {location.name}
                                  </h3>
                                </div>
                                <span className="text-xs pl-25 text-gray-400 italic mt-1">
                                  {location.distance}
                                </span>
                              </div>
                            </div>

                            <div className="pl-10 w-70 text-gray-700 text-sm md:text-base leading-relaxed mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-3 h-3" />
                                <span className="text-xs">{location.address}</span>
                              </div>
                              <div className="flex w-45 items-center gap-2 mb-2">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs leading-none">{location.hours}</span>
                              </div>
                            </div>
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Checking availability...</span>
                              </div>
                            ) : ( 
                              <div className="pl-5">
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
                              )}
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Email Toggle as a big toggle button */}
            <div className="mb-6 flex justify-center gap-4">
              <button
                onClick={() => setWantsEmail(true)}
                className={`px-4 py-2 rounded-full font-semibold cursor-pointer transition 
                  ${wantsEmail 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                aria-pressed={wantsEmail}
              >
                TELL ME ASAP
              </button>

              <button
                onClick={() => setWantsEmail(false)}
                className={`px-4 py-2 rounded-full font-semibold cursor-pointer transition 
                  ${!wantsEmail
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                aria-pressed={!wantsEmail}
              >
                DND SNOOZE
              </button>
            </div>

            <div className="text-center ">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={isLoading}
                className="px-4 py-2 rounded-full font-semibold bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
