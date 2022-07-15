import { Image, TouchableOpacity, View, Text } from "react-native";
import { LocationMarkerIcon, StarIcon } from "react-native-heroicons/outline";
import { urlFor } from "../sanity";
import { useNavigation } from "@react-navigation/native";

export default function RestaurantCard(props) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity 
            onPress={() => {
                navigation.navigate('Restaurant', {
                    id: props.id,
                    imgUrl: props.imgUrl,
                    title: props.title,
                    rating: props.rating,
                    genre: props.genre,
                    address: props.address,
                    short_description: props.short_description,
                    dishes: props.dishes,
                    long: props.long,
                    lat: props.lat
                })
            }}
            className="bg-white mr-3 shadow"
        >
            <Image
                source={{ uri: urlFor(props.imgUrl).url() }}
                className="h-36 w-64 rounded-sm"
            />

            <View className="px-3 pb-4">
                <Text className="pt-2 text-lg font-bold">{props.title}</Text>
                <View className="flex-row items-center space-x-1">
                    <StarIcon color="green" opacity={0.5} size={22} />
                    <Text className="text-gray-500 text-xs">
                        <Text className="text-green-500">{props.rating}</Text> {props.genre}
                    </Text>
                </View>

                <View className="flex-row items-center space-x-1">
                    <LocationMarkerIcon color="gray" opacity={0.4} size={22} />
                    <Text className="text-xs text-gray-500">Nearby {props.address}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}