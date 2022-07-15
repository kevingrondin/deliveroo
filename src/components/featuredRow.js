import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { ArrowRightIcon } from 'react-native-heroicons/outline'
import RestaurantCard from './restaurantCard'
import sanityClient from '../sanity'

export default function FeaturedRow({ id, title, description }) {
    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {
        sanityClient.fetch(
            `
                *[_type == "featured" && _id == $id]{
                    ...,
                    restaurants[]->{
                        ...,
                        dishes[]->,
                        type-> {
                            name
                        }
                    },
                }[0]
            `,
            { id }
        ).then(data => {
            setRestaurants(data?.restaurants)
        })
    }, [id])

    return (
        <View>
            <View className="mt-4 flex-row items-center justify-between px-2">
                <Text className="font-bold text-lg">{title}</Text>
                <ArrowRightIcon color="#00CCBB" />
            </View>

            <Text className="text-xs text-gray-500 px-2">{description}</Text>

            <ScrollView
                horizontal
                contentContainerStyle={{
                    paddingHorizontal: 15,
                }}
                showsHorizontalScrollIndicator={false}
                className="pt-4"
            >
                {restaurants?.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant._id}
                        id={restaurant._id}
                        imgUrl={restaurant.image}
                        address={restaurant.address}
                        title={restaurant.name}
                        dishes={restaurant.dishes}
                        rating={restaurant.rating}
                        short_description={restaurant.short_description}
                        genre={restaurant.type?.name}
                        long={restaurant.long}
                        lat={restaurant.lat}
                    />
                ))}
            </ScrollView>
        </View>
    )
}