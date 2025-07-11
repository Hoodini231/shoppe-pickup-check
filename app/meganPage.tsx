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
const TOGGLE_NOTIFICATION_URL = process.env.NEXT_PUBLIC_NOTIFY_LAMBDA_URL || ""
const FETCH_JSON_URL = process.env.NEXT_PUBLIC_JSON_URL || ""

interface PickupLocation {
  id: string
  name: string
  address: string
  distance: string
  hours: string
  isAvail: boolean
}

const initialPickupLocations: PickupLocation[] = [
  {
    id: process.env.NEXT_PUBLIC_PICKUP_LOCATION_0_ID || "",
    name: process.env.NEXT_PUBLIC_PICKUP_LOCATION_0_NAME || "Megan's Pickup Location",
    address: process.env.NEXT_PUBLIC_PICKUP_LOCATION_0_ADDRESS || "123 Megan Street, Singapore",
    distance: process.env.NEXT_PUBLIC_PICKUP_LOCATION_0_DISTANCE || "0.00km",
    hours: "Open Mon-Sun 09:00-21:00",
    isAvail: false,
  },
  {
    id: process.env.NEXT_PUBLIC_PICKUP_LOCATION_1_ID || "",
    name: process.env.NEXT_PUBLIC_PICKUP_LOCATION_1_NAME || "Megan's Pickup Location",
    address: process.env.NEXT_PUBLIC_PICKUP_LOCATION_1_ADDRESS || "123 Megan Street, Singapore",
    distance: process.env.NEXT_PUBLIC_PICKUP_LOCATION_1_DISTANCE || "0.00km",
    hours: "Open Mon-Sat 08:30-17:30 Sun 08:30-17:00",
    isAvail: false,
  }
]

export default function ShopeePickupChecker() {
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [wantsEmail, setWantsEmail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>(initialPickupLocations)

  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["fetchAvailability"],
    queryFn: async () => {
      const res = await fetch(FETCH_JSON_URL)
      if (!res.ok) throw new Error("Failed to fetch availability")
      const json = await res.json()
      const entries = Object.entries(json) as [string, PickupLocation][]
      setPickupLocations(currentLocations => {
        return currentLocations.map(loc => {
          const foundEntry = entries.find(([key]) => key === loc.id.toString())
          if (foundEntry) {
            const [, value] = foundEntry
            return { ...loc, isAvail: value.isAvail }
          }
          return loc
        })
      })
      return json
    },
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  })

  async function toggleNotification(isOn: boolean) {
    try {
      setWantsEmail(isOn)
      const response = await fetch(TOGGLE_NOTIFICATION_URL, {
        method: "POST",
        body: JSON.stringify({ isNotificationOn: isOn }),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      console.log("Notification toggle response:" , isOn)
      return await response.json()
    } catch (error) {
      console.error("Error posting to Lambda:", error)
      throw error
    }
  }

  useEffect(() => {
    setIsLoading(isFetching)
  }, [isFetching])

  if (error) return <div>Error loading</div>

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden"
      style={{ maxWidth: 375, margin: "0 auto" }} // constrain outer container width to iPhone SE width
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://wallpapers.com/images/high/pastel-orange-flower-nice-desktop-j6lqopu619oc2kd3.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <header className="relative z-10 text-center py-6" style={{ paddingLeft: 12, paddingRight: 12 }}>
        <div className="flex items-center justify-center gap-1 mb-2 flex-wrap">
          <h1 className="text-3xl font-bold text-gray-800">Megan</h1>
          <div className="bg-orange-500 p-1 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-orange-500 text-3xl font-bold">Shopee</span>
          <h1 className="text-3xl font-bold text-gray-800">Pickup Check</h1>
        </div>
      </header>

      <div
        className="relative z-10 mx-auto px-3 pb-6 flex flex-col items-center"
        style={{ maxWidth: 375 }} // max width constrain
      >
        <Card
          className="w-full shadow-lg rounded-lg bg-white"
          style={{ maxWidth: 360, margin: "0 auto" }} // card max width smaller than container
        >
          <CardContent className="flex flex-col p-4">
            <div className="mb-6 text-center">
              <h2 className="text-base font-bold text-gray-700 mb-1">
                Collect from points near your address
              </h2>
              <h2
                className="text-lg font-bold text-gray-800 mb-3 bg-orange-100 rounded-md px-2 py-1 inline-block"
                style={{ fontSize: "1rem" }}
              >
                {`${MEGAN_ADDRESS || "Megan's Address"}`}
              </h2>

              <RadioGroup value={selectedLocation} onValueChange={setSelectedLocation}>
                <div className="space-y-4">
                  {pickupLocations.map((location) => (
                    <div
                      key={location.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <div className="flex items-start">
                        <RadioGroupItem value={location.id} id={location.id} className="mt-1 hidden" />
                        <div className="flex-1">
                          <Label htmlFor={location.id} className="cursor-pointer">
                              <div className="flex justify-start gap-1 mb-2">
                                <h3 className="font-semibold text-gray-900 text-[18px] w-32">
                                  {location.name}
                                </h3>
                              </div>
                            {isLoading ? (
                              <div className="flex justify-end pl-16">
                                <span className="inline-block w-24 py-0.5 rounded-full text-[14px] font-semibold bg-gray-200">
                                  Checking availability...
                                </span>
                              </div>
                            ) : (
                              <div className="flex justify-end pl-16">
                                <span
                                  className={`inline-block w-24 py-0.5 rounded-full text-[14px] font-semibold ${
                                    location.isAvail
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {location.isAvail ? "Available" : "Unavailable"}
                                </span>
                              </div>
                            )}
                          </Label>
                           <div className="w-full text-gray-700 leading-relaxed mb-2 ml-4">
                            <div className="flex items-center gap-1 mb-1">
                              <MapPin className="w-3 h-3" />
                              <span className="text-[10px]">{location.address}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-[10px] leading-none">{location.hours}</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="mb-5 flex justify-center gap-3">
              <button
                onClick={() => toggleNotification(true)}
                className={`px-3 py-1 rounded-full font-semibold cursor-pointer transition 
                  ${wantsEmail ? "bg-orange-500 text-white shadow-md" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                aria-pressed={wantsEmail}
              >
                TELL ME ASAP
              </button>

              <button
                onClick={() => toggleNotification(false)}
                className={`px-3 py-1 rounded-full font-semibold cursor-pointer transition 
                  ${!wantsEmail ? "bg-orange-500 text-white shadow-md" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                aria-pressed={!wantsEmail}
              >
                DND SNOOZE
              </button>
            </div>

            <div className="text-center">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={isLoading}
                className="px-3 py-1 rounded-full font-semibold bg-gray-200 text-gray-600 hover:bg-gray-300"
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
